import { Injectable } from '@angular/core';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
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
  chartBarData!: IChartProps;
  chartDoughnutData!: IChartProps;
  chartPieData!: IChartProps;
  chartPolarAreaData!: IChartProps;
  chartRadarData!: IChartProps;

  constructor() {
    this.initMainChart();
    this.initBarChart();
    this.initDoughnutChart();
    this.initPieChart();
    this.initPolarAreaChart();
    this.initRadarChart();
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Main Line Chart Initialization
  initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';

    this.mainChart['elements'] = period === 'Month' ? 12 : 27;
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    for (let i = 0; i <= this.mainChart['elements']; i++) {
      this.mainChart['Data1'].push(this.random(50, 240));
      this.mainChart['Data2'].push(this.random(20, 160));
      this.mainChart['Data3'].push(65);
    }

    let labels: string[] = [];
    if (period === 'Month') {
      labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    } else {
      const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      labels = week.concat(week, week, week);
    }

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
      { data: this.mainChart['Data1'], label: 'Current', ...colors[0] },
      { data: this.mainChart['Data2'], label: 'Previous', ...colors[1] },
      { data: this.mainChart['Data3'], label: 'BEP', ...colors[2] }
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
    this.mainChart.data = { datasets, labels };
  }

  // Bar Chart Initialization
  initBarChart() {
    this.chartBarData = {
      type: 'bar',
      options: {
        maintainAspectRatio: false,
        scales: this.getScales(),
      },
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'GitHub Commits',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 17, 42, 79]
          }
        ]
      }
    };
  }

  // Doughnut Chart Initialization
  initDoughnutChart() {
    this.chartDoughnutData = {
      type: 'doughnut',
      options: { maintainAspectRatio: false },
      data: {
        labels: ['VueJs', 'EmberJs', 'ReactJs', 'Angular'],
        datasets: [{
          backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
          data: [40, 20, 80, 10]
        }]
      }
    };
  }

  // Pie Chart Initialization
  initPieChart() {
    this.chartPieData = {
      type: 'pie',
      options: { maintainAspectRatio: false },
      data: {
        labels: ['Red', 'Green', 'Yellow'],
        datasets: [{
          data: [300, 50, 100],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }
    };
  }

  // Polar Area Chart Initialization
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

  // Radar Chart Initialization
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
}
