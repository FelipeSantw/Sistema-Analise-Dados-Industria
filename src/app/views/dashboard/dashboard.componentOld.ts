import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // HttpClient para carregar JSON
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';

interface IMachine {
  id: number;
  name: string;
  type: string;
  productionCapacity: number;
  plannedProductionTime: number;
  location: string;
  status: string;
  oeePercentage: number;
}

interface IProduction {
  id: number;
  productionTime: number;
  itemsProduced: number;
  defectiveItems: number;
  productionDate: number;
  shift: string;
  machineId: number;
  oeePercentage: number;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent,
    ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent,
    FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective,
    ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent,
    TableDirective, AvatarComponent
  ]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);
  private http: HttpClient = inject(HttpClient); // Injeção de HttpClient para carregar JSON

  // Dados de máquinas e produção
  public machines: IMachine[] = [];
  public production: IProduction[] = [];

  public mainChart: IChartProps = { type: 'line' };
  public chartBarData: IChartProps = { type: 'bar' };
  public chartDoughnutData: IChartProps = { type: 'doughnut' };
  public chartPieData: IChartProps = { type: 'pie' };
  public chartPolarAreaData: IChartProps = { type: 'polarArea' };
  public chartRadarData: IChartProps = { type: 'radar' };

  // Formulário para seleção de dados dos gráficos
  public dataSelectionForm = new FormGroup({
    xAxis: new FormControl('oeePercentage'),
    yAxis: new FormControl('name') 
  });

  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });
  initCharts: any;

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.updateAllCharts();
  }

  updateAllCharts(): void {
    const xAxis = this.dataSelectionForm.get('xAxis')?.value ?? 'oeePercentage';
    const yAxis = this.dataSelectionForm.get('yAxis')?.value ?? 'name';
  
    if (typeof xAxis === 'string' && typeof yAxis === 'string') {
      this.mainChart.data = {
        labels: this.machines.map((machine: IMachine) => machine[yAxis as keyof IMachine]),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: this.machines.map((machine: IMachine) => {
            const value = machine[xAxis as keyof IMachine];
            return typeof value === 'number' ? value : null;
          }),
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      };
  
      this.chartBarData.data = {
        labels: this.machines.map((machine: IMachine) => machine[yAxis as keyof IMachine]),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: this.machines.map((machine: IMachine) => {
            const value = machine[xAxis as keyof IMachine];
            return typeof value === 'number' ? value : null;
          }),
          backgroundColor: '#f87979'
        }]
      };
  
      this.chartDoughnutData.data = {
        labels: this.machines.map((machine: IMachine) => machine[yAxis as keyof IMachine]),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: this.machines.map((machine: IMachine) => {
            const value = machine[xAxis as keyof IMachine];
            return typeof value === 'number' ? value : null; 
          }),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      };
  
      this.chartPieData.data = {
        labels: this.machines.map((machine: IMachine) => machine[yAxis as keyof IMachine]),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: this.machines.map((machine: IMachine) => {
            const value = machine[xAxis as keyof IMachine];
            return typeof value === 'number' ? value : null;
          }),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      };
  
      this.chartPolarAreaData.data = {
        labels: this.machines.map((machine: IMachine) => machine[yAxis as keyof IMachine]),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: this.machines.map((machine: IMachine) => {
            const value = machine[xAxis as keyof IMachine];
            return typeof value === 'number' ? value : null;
          }),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      };
  
      this.chartRadarData.data = {
        labels: this.machines.map((machine: IMachine) => machine[yAxis as keyof IMachine]),
        datasets: [{
          label: `${yAxis} vs ${xAxis}`,
          data: this.machines.map((machine: IMachine) => {
            const value = machine[xAxis as keyof IMachine];
            return typeof value === 'number' ? value : null;
          }),
          backgroundColor: 'rgba(179,181,198,0.2)',
          borderColor: 'rgba(179,181,198,1)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)'
        }]
      };
    }
  }

  setTrafficPeriod(value: string): void {
    const currentYAxis = this.dataSelectionForm.get('yAxis')?.value ?? 'name';
    
    this.dataSelectionForm.setValue({ 
      xAxis: value, 
      yAxis: currentYAxis 
    });
  
    this.updateAllCharts();
  }

  handleChartRef($chartRef: any) {
    if ($chartRef) {
      this.mainChartRef.set($chartRef);
    }
  }

  updateChartOnColorModeChange() {
    const unListen = this.#renderer.listen(this.#document.documentElement, 'ColorSchemeChange', () => {
      this.setChartStyles();
    });

    this.#destroyRef.onDestroy(() => {
      unListen();
    });
  }

  setChartStyles() {
    if (this.mainChartRef()) {
      setTimeout(() => {
        const options: ChartOptions = { ...this.mainChart.options };
        const scales = this.#chartsData.getScales();
        this.mainChartRef().options.scales = { ...options.scales, ...scales };
        this.mainChartRef().update();
      });
    }
  }
}
