import { Component, OnInit } from '@angular/core';
import { DOCUMENT, NgStyle, CommonModule } from '@angular/common';
import { DestroyRef, effect, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { CardModule, AvatarComponent, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, FormCheckLabelDirective, GutterDirective, ProgressBarDirective, ProgressComponent, RowComponent, TableDirective, TextColorDirective } from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { machinesData } from '../../../assets/mockdata/machines';
import { productionData } from '../../../assets/mockdata/production';

interface Machine {
  id: number;
  name: string;
  type: string;
  productionCapacity: number;
  plannedProductionTime: number;
  location: string;
  status: string;
  oeePercentage: number;
}

interface Production {
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
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [
    WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent,
    ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent,
    FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective,
    ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent,
    TableDirective, AvatarComponent, CardModule, CommonModule
  ]
})
export class DashboardComponent implements OnInit {

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  public machines: Machine[] = machinesData;
  public productions: Production[] = productionData;
  public selectedMachineId: number | null = null;
  public selectedProductions: Production[] = [];

  public mainChart: IChartProps = { type: 'line' };
  public chartBarData: IChartProps = { type: 'bar' };
  public chartDoughnutData: IChartProps = { type: 'doughnut' };
  public chartPieData: IChartProps = { type: 'pie' };
  public chartPolarAreaData: IChartProps = { type: 'polarArea' };
  public chartRadarData: IChartProps = { type: 'radar' };

  public mainChartRef: WritableSignal<any> = signal(undefined);
  #mainChartRefEffect = effect(() => {
    if (this.mainChartRef()) {
      this.setChartStyles();
    }
  });

  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  ngOnInit(): void {
    this.initCharts();
    this.updateChartOnColorModeChange();
    this.loadMachines();
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
    this.chartBarData = this.#chartsData.chartBarData;
    this.chartDoughnutData = this.#chartsData.chartDoughnutData;
    this.chartPieData = this.#chartsData.chartPieData;
    this.chartPolarAreaData = this.#chartsData.chartPolarAreaData;
    this.chartRadarData = this.#chartsData.chartRadarData;
  }

  loadMachines(): void {
    console.log('Machines loaded:', this.machines);
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

  onMachineSelect(event: Event): void {
    const machineId = Number((event.target as HTMLSelectElement).value);
    this.selectedMachineId = machineId;
  
    console.log('Selected Machine ID:', this.selectedMachineId);
  
    this.selectedProductions = this.productions.filter(
      production => production.machineId === this.selectedMachineId
    );
  
    console.log('Selected Productions:', this.selectedProductions);
  
    this.updateChartsWithSelectedProductions();
  }

  updateChartsWithSelectedProductions(): void {
    const sortedProductions = this.selectedProductions.sort((a, b) => a.productionDate - b.productionDate);
  
    const productionTimes = sortedProductions.map(p => p.productionTime);
    const itemsProduced = sortedProductions.map(p => p.itemsProduced);
    const defectiveItems = sortedProductions.map(p => p.defectiveItems);
    const oeePercentages = sortedProductions.map(p => p.oeePercentage);
    const shifts = sortedProductions.map(p => p.shift); 
    const labels = sortedProductions.map(p => {
      const date = new Date(p.productionDate);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    });
  
    const totalItemsProduced = itemsProduced.reduce((acc, produced) => acc + produced, 0);
    const totalDefectiveItems = defectiveItems.reduce((acc, defects) => acc + defects, 0);
    const successfulItems = totalItemsProduced - totalDefectiveItems;
  
    const successfulItemsPercent = (successfulItems / totalItemsProduced) * 100;
    const defectiveItemsPercent = (totalDefectiveItems / totalItemsProduced) * 100;
  
    this.#chartsData.updateMainChartData(itemsProduced, defectiveItems, labels);
    this.#chartsData.updateBarChartData(oeePercentages, labels);
    this.#chartsData.updateDoughnutChartData(itemsProduced, defectiveItems);
    this.#chartsData.updatePieChartData(defectiveItems);
  }
}
