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
    this.initPolarAreaChart();
    this.initRadarChart();
  }

  // Funções para atualizar os dados dos gráficos
  updateMainChartData(itemsProduced: number[], defectiveItems: number[], labels: string[]) {
    // Ajusta dinamicamente o limite máximo do eixo Y com base nos valores fornecidos
    const maxY = Math.max(...itemsProduced, ...defectiveItems) + 10; // Adiciona uma margem de 10

    this.mainChart.data = {
      labels: labels,
      datasets: [
        {
          label: 'Items Produced',
          data: itemsProduced,
          borderColor: '#20a8d8',
          backgroundColor: 'rgba(32, 168, 216, 0.2)',
          fill: true,
        },
        {
          label: 'Defective Items',
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

    // Atualiza o gráfico com os novos dados e o limite de escala dinâmico
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
            stepSize: Math.ceil(maxY / 5), // Divide o eixo Y em 5 passos
          },
          min: 0,
          max: maxY // Ajusta dinamicamente o valor máximo do eixo Y
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
    // Calcula a linha de tendência com base nos dados de OEE
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
          label: 'Tendency Line',
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
      labels: ['Items Produced', 'Defective Items'],
      datasets: [{
        data: [totalItemsProduced, totalDefectiveItems],
        backgroundColor: ['#41B883', '#E46651'], // Verde para itens produzidos corretamente, vermelho para defeituosos
      }]
    };
  }

  updatePieChartData(defectiveItems: number[]) {
    this.chartPieData.data = {
      labels: ['Defective Items'],
      datasets: [{ data: defectiveItems, backgroundColor: ['#FF6384', '#36A2EB'] }]
    };
  }

  // Inicialização dos gráficos
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
  
    // Iniciando o gráfico sem dados
    const datasets: ChartDataset[] = [
      { data: [], label: 'Items Produced', ...colors[0] },
      { data: [], label: 'Defective Items', ...colors[1] },
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
    this.mainChart.data = { datasets, labels: [] }; // Sem dados no início
  }

  initBarChart() {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b'; // Linha de tendência em cor diferente
  
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
            max: 100, // OEE vai de 0 a 100%
            ticks: {
              stepSize: 10,
              color: '#000',
              callback: function(tickValue: string | number) {
                return `${Number(tickValue)}%`; // Adiciona o símbolo de porcentagem no eixo Y
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
              label: (context) => `${context.raw}%`, // Mostra o valor com % no tooltip
            }
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            formatter: (value: number) => `${value}%`, // Formata os rótulos de cada barra com %
            color: '#000',
          }
        },
        elements: {
          bar: {
            borderRadius: 5, // Adiciona borda arredondada nas colunas
            borderWidth: 2,
            backgroundColor: brandSuccess,
            borderColor: brandSuccess
          }
        }
      },
      data: {
        labels: [], // As datas serão preenchidas dinamicamente
        datasets: [
          {
            label: 'OEE %',
            data: [], // Os valores de OEE serão preenchidos dinamicamente
            backgroundColor: brandSuccess,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: brandSuccess,
          },
          {
            label: 'Tendency Line', // Linha de tendência
            type: 'line', // Tipo de gráfico linha
            data: [], // Valores da linha de tendência
            borderColor: brandDanger, // Cor da linha
            borderWidth: 2,
            fill: false, // Sem preenchimento abaixo da linha
            pointRadius: 0, // Sem pontos visíveis
            tension: 0.4, // Curvatura leve na linha
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
              label: (context) => `${context.label}: ${context.raw} units`, // Exibe as unidades produzidas
            }
          },
          // Configuração para exibir rótulos nas fatias do gráfico
          datalabels: {
            formatter: (value: number, context) => {
              const labels = context.chart.data.labels;
              if (labels && labels[context.dataIndex]) {
                const label = labels[context.dataIndex];
                return `${label}: ${value} units`; // Exibe o rótulo com o valor
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
        labels: ['Items Produced', 'Defective Items'], 
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

  // Inicialização do gráfico Polar Area
  initPolarAreaChart() {
    this.chartPolarAreaData = {
      type: 'polarArea',
      options: { maintainAspectRatio: false },
      data: {
        labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
        datasets: [{
          data: [11, 16, 7, 3, 14],
          backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB']
        }]
      }
    };
  }

  // Inicialização do gráfico Radar
  initRadarChart() {
    this.chartRadarData = {
      type: 'radar',
      options: { maintainAspectRatio: false },
      data: {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
          {
            label: '2020',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            data: [65, 59, 90, 81, 56, 55, 40]
          },
          {
            label: '2021',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderColor: '#fff',
            data: [28, 48, 40, 19, 96, 27, 100]
          }
        ]
      }
    };
  }

  // Configurações de escalas
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
