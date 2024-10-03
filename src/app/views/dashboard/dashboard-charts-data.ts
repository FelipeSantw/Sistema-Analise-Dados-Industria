import { Injectable } from '@angular/core';
import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  selectedProductions: any;
  chartRadarRef: any;
  initCharts(value: string) {
    throw new Error('Method not implemented.');
  }
  chartBarData!: IChartProps;
  chartDoughnutData!: IChartProps;
  chartPieData!: IChartProps;
  chartPolarAreaData!: IChartProps;
  chartRadarData!: IChartProps;

  public mainChart: IChartProps = { type: 'line' };

  constructor() {
    this.initMainChart();
    this.initBarChart();
    this.initDoughnutChart();
    this.initPieChart();
    this.initRadarChart();
  }

  updateMainChartData(itemsProduced: number[], defectiveItems: number[], labels: string[]) {
    const maxY = Math.max(...itemsProduced, ...defectiveItems) + 10;

    this.mainChart.data = {
      labels: labels,
      datasets: [
        {
          label: 'Itens Produzidos',
          data: itemsProduced,
          borderColor: '#20a8d8',
          backgroundColor: 'rgba(32, 168, 216, 0.2)',
          fill: true,
        },
        {
          label: 'Itens Defeituosos',
          data: defectiveItems,
          borderColor: '#f86c6b',
          backgroundColor: 'rgba(248, 108, 107, 0.2)',
          fill: true,
        },
        {
          label: 'Trend Line',
          data: this.calculateTrendLine(itemsProduced),
          borderColor: '#4dbd74',
          borderDash: [5, 5],
          fill: false,
        }
      ]
    };

    this.mainChart.options = {
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: '#000' },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: '#000',
            stepSize: Math.ceil(maxY / 5),
          },
          min: 0,
          max: maxY 
        }
      },
      elements: {
        line: { tension: 0.4 },
        point: { radius: 5, hoverRadius: 8 },
      }
    };
  }

  calculateTrendLine(data: number[]): number[] {
    let trendLine: number[] = [];
    let windowSize = 3;

    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const slice = data.slice(start, i + 1);
      const sum = slice.reduce((acc, curr) => acc + curr, 0);
      trendLine.push(sum / slice.length);
    }

    return trendLine;
  }

  updateBarChartData(oeePercentages: number[], labels: string[]): void {
    const trendLine = this.calculateTrendLine(oeePercentages);
  
    this.chartBarData.data = {
      labels: labels,
      datasets: [
        {
          label: 'OEE %',
          data: oeePercentages, 
          backgroundColor: '#4dbd74',
          borderRadius: 5,
          borderWidth: 2,
          borderColor: '#4dbd74',
        },
        {
          label: 'Linha de Tendência',
          type: 'line', 
          data: trendLine, 
          borderColor: '#f86c6b', 
          borderWidth: 2,
          fill: false, 
          pointRadius: 0, 
          tension: 0.4, 
        }
      ]
    };
  }

  updateDoughnutChartData(itemsProduced: number[], defectiveItems: number[]): void {
    const totalItemsProduced = itemsProduced.reduce((acc, produced) => acc + produced, 0);
    const totalDefectiveItems = defectiveItems.reduce((acc, defective) => acc + defective, 0);
  
    this.chartDoughnutData.data = {
      labels: ['Itens Produzidos', 'Itens Defeituosos'],
      datasets: [{
        data: [totalItemsProduced, totalDefectiveItems],
        backgroundColor: ['#41B883', '#E46651'],
      }]
    };
  }

  updatePieChartData(defectiveItems: number[]) {
    this.chartPieData.data = {
      labels: ['Itens Defeituosos'],
      datasets: [{ data: defectiveItems, backgroundColor: ['#FF6384', '#36A2EB'] }]
    };
  }
  
  updateRadarChartData(averageDataByShift: any, shifts: string[]): void {
    const shiftColors = [
      { backgroundColor: 'rgba(75,192,192,0.2)', borderColor: 'rgba(75,192,192,1)' }, 
      { backgroundColor: 'rgba(255,99,132,0.2)', borderColor: 'rgba(255,99,132,1)' }, 
      { backgroundColor: 'rgba(54,162,235,0.2)', borderColor: 'rgba(54,162,235,1)' } 
    ];
  
    this.chartRadarData.data = {
      labels: ['Tempo de Produção', 'Itens Produzidos (%)', 'Itens Defeituosos (%)'],
      datasets: shifts.map((shift, index) => {
        const colorIndex = index % shiftColors.length; 
        const colors = shiftColors[colorIndex];
  
        return {
          label: shift,
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          pointBackgroundColor: colors.borderColor,
          pointBorderColor: '#fff',
          data: [
            averageDataByShift[shift].productionTime,  
            averageDataByShift[shift].itemsProduced,
            averageDataByShift[shift].defectiveItems 
          ]
        };
      })
    };
  
    if (this.chartRadarRef) {
      this.chartRadarRef.update();
    }
  }

  initMainChart() {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';
  
    const colors = [
      {
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: '#fff'
      },
      {
        backgroundColor: 'transparent',
        borderColor: brandDanger,
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];
  
    const datasets: ChartDataset[] = [
      { data: [], label: 'Itens Produzidos', ...colors[0] },
      { data: [], label: 'Itens Defeituosos', ...colors[1] },
      { data: [], label: 'Trend Line', ...colors[2] }
    ];
  
    const plugins: DeepPartial<PluginOptionsByType<any>> = {
      legend: { display: false },
      tooltip: {
        callbacks: {
          labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
        }
      }
    };
  
    const scales = this.getScales();
  
    const options: ChartOptions = {
      maintainAspectRatio: false,
      plugins,
      scales,
      elements: {
        line: { tension: 0.4 },
        point: { radius: 0, hitRadius: 10, hoverRadius: 4, hoverBorderWidth: 3 }
      }
    };
  
    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = { datasets, labels: [] }; 
  }

  initBarChart() {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';
  
    this.chartBarData = {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#000' },
          },
          y: {
            beginAtZero: true,
            max: 100, 
            ticks: {
              stepSize: 10,
              color: '#000',
              callback: function(tickValue: string | number) {
                return `${Number(tickValue)}%`; 
              }
            },
            grid: {
              color: '#eaeaea',
            },
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}%`, 
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (value: number) => `${value}%`, 
            color: '#000',
          }
        },
        elements: {
          bar: {
            borderRadius: 5, 
            borderWidth: 2,
            backgroundColor: brandSuccess,
            borderColor: brandSuccess
          }
        }
      },
      data: {
        labels: [], 
        datasets: [
          {
            label: 'OEE %',
            data: [], 
            backgroundColor: brandSuccess,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: brandSuccess,
          },
          {
            label: 'Linha de Tendência', 
            type: 'line', 
            data: [], 
            borderColor: brandDanger, 
            borderWidth: 2,
            fill: false, 
            pointRadius: 0,
            tension: 0.4, 
          }
        ]
      }
    };
  }

  initDoughnutChart() {
    this.chartDoughnutData = {
      type: 'doughnut',
      options: {
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw} units`, 
            }
          },
          datalabels: {
            formatter: (value: number, context) => {
              const labels = context.chart.data.labels;
              if (labels && labels[context.dataIndex]) {
                const label = labels[context.dataIndex];
                return `${label}: ${value} units`;
              }
              return `${value} units`; 
            },
            color: '#fff', 
            font: {
              weight: 'bold',
              size: 14,
            },
            anchor: 'center',
            align: 'center',
          }
        }
      },
      data: {
        labels: ['Com Sucesso', 'Com Defeitos'], 
        datasets: [{
          backgroundColor: ['#41B883', '#E46651'], 
          data: [0, 0],
        }]
      }
    };
  }

  initPieChart() {
    this.chartPieData = {
      type: 'pie',
      options: { maintainAspectRatio: false },
      data: {
        labels: ['Defective Items'],
        datasets: [{
          data: [300, 50],
          backgroundColor: ['#FF6384', '#36A2EB'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
      }
    };
  }

  initRadarChart(): void {
    this.chartRadarData = {
      type: 'radar',
      options: { maintainAspectRatio: false },
      data: {
        labels: ['Tempo de Produção', 'Itens Produzidos', 'Itens Defeituosos'],
        datasets: []
      }
    };
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      x: {
        grid: { color: colorBorderTranslucent, drawOnChartArea: false },
        ticks: { color: colorBody }
      },
      y: {
        border: { color: colorBorderTranslucent },
        grid: { color: colorBorderTranslucent },
        max: 250,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5)
        }
      }
    };
    return scales;
  }

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
