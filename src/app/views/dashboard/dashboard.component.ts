import { Component, OnInit } from '@angular/core';
import { DOCUMENT, NgStyle, CommonModule } from '@angular/common';
import { DestroyRef, effect, inject, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { CardModule, AvatarComponent, ButtonDirective, ButtonGroupComponent, CardBodyComponent, CardComponent, CardFooterComponent, CardHeaderComponent, ColComponent, FormCheckLabelDirective, GutterDirective, ProgressBarDirective, ProgressComponent, RowComponent, TableDirective, TextColorDirective } from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { SyncService } from './sync.service';
import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
// import { machinesData } from '../../../assets/mockdata/machines';  // Dados mockados
// import { productionData } from '../../../assets/mockdata/production'; 

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
  providers: [
    SyncService
  ],
  imports: [
    WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent,
    ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent,
    FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective,
    ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent,
    TableDirective, AvatarComponent, CardModule, CommonModule
  ]
})
export class DashboardComponent implements OnInit {
  selectedMachine: any;

  constructor(private syncService: SyncService) {}

  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #document: Document = inject(DOCUMENT);
  readonly #renderer: Renderer2 = inject(Renderer2);
  readonly #chartsData: DashboardChartsData = inject(DashboardChartsData);

  public machines: Machine[] = []; 
  public productions: Production[] = [];
  public selectedMachineId: number | null = null;
  public selectedProductions: Production[] = [];

  public mainChart: IChartProps = { type: 'line' };
  public chartBarData: IChartProps = { type: 'bar' };
  public chartDoughnutData: IChartProps = { type: 'doughnut' };
  public chartPieData: IChartProps = { type: 'pie' };
  public chartPolarAreaData: IChartProps = { type: 'polarArea' };
  public chartRadarData: IChartProps = {
    type: 'radar',
    data: {
      labels: [],
      datasets: []
    },
    options: { maintainAspectRatio: false }
  };

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
    this.loadMachinesFromAPI();
  }

  loadMachinesFromAPI(): void {
    this.syncService.getMachines().subscribe({
      next: (response: any) => {
        this.machines = response.data;
        console.log('Machines loaded from API:', this.machines);
      },
      error: (error) => {
        console.error('Error loading machines from API:', error);
      }
    });
  }

  onMachineSelect(event: Event): void {
    const machineId = Number((event.target as HTMLSelectElement).value);
    this.selectedMachineId = machineId;
  
    console.log('Selected Machine ID:', this.selectedMachineId);
    this.syncService.getMachines().subscribe({
      next: (response: any) => {
        const machines = response.data;
        this.selectedMachine = machines.find((machine: any) => machine.id === this.selectedMachineId);
        console.log('Selected Machine:', this.selectedMachine);
      },
      error: (error: any) => {
        console.error('Erro ao buscar informações da máquina:', error);
      }
    });
    this.syncService.getProductionByMachineId(this.selectedMachineId).subscribe({
      next: (response: any) => {
        const productions = response.data;
  
        if (Array.isArray(productions)) {
          this.selectedProductions = productions;
          console.log('Selected Productions:', this.selectedProductions);
  
          this.updateChartsWithSelectedProductions();
        } else {
          console.error('Productions is not an array:', productions);
          this.selectedProductions = []; 
        }
      },
      error: (error: any) => {
        console.error('Erro ao buscar produções:', error);
        this.selectedProductions = []; 
      }
    });
  }

  onSyncData(): void {
    this.syncService.syncData().subscribe({
      next: (data: any) => {
        console.log('Dados sincronizados com sucesso:', data);
      },
      error: (error: any) => {
        console.error('Erro ao sincronizar dados:', error);
        if (error.status) {
          console.error(`Status: ${error.status}`);
        }
        if (error.message) {
          console.error(`Mensagem de erro: ${error.message}`);
        }
      }
    });
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
    this.chartBarData = this.#chartsData.chartBarData;
    this.chartDoughnutData = this.#chartsData.chartDoughnutData;
    this.chartPieData = this.#chartsData.chartPieData;
    this.chartPolarAreaData = this.#chartsData.chartPolarAreaData;
    this.chartRadarData = this.#chartsData.chartRadarData;
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

  updateChartsWithSelectedProductions(): void {

    const sortedProductions = this.selectedProductions.sort((a, b) => {
      const dateA = typeof a.productionDate === 'string' ? parseInt(a.productionDate, 10) : a.productionDate;
      const dateB = typeof b.productionDate === 'string' ? parseInt(b.productionDate, 10) : b.productionDate;
      return dateA - dateB;
    });
    const productionTimes = sortedProductions.map(p => p.productionTime);
    const itemsProduced = sortedProductions.map(p => p.itemsProduced);
    const defectiveItems = sortedProductions.map(p => p.defectiveItems);
    const oeePercentages = sortedProductions.map(p => p.oeePercentage);
    const shifts = sortedProductions.map(p => p.shift);

    const labels = sortedProductions.map(p => {
    const productionDate = typeof p.productionDate === 'string' ? parseInt(p.productionDate, 10) : p.productionDate;
    const date = new Date(productionDate);
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
  
    const shiftsUnique = [...new Set(shifts)];
    const averageDataByShift: { [key: string]: { productionTime: number; itemsProduced: number; defectiveItems: number; count: number } } = {};
  
    shiftsUnique.forEach(shift => {
      averageDataByShift[shift] = { productionTime: 0, itemsProduced: 0, defectiveItems: 0, count: 0 };
    });
  
    sortedProductions.forEach(production => {
      const shift = production.shift;
      if (averageDataByShift[shift]) {
        averageDataByShift[shift].productionTime += production.productionTime;
        averageDataByShift[shift].itemsProduced += production.itemsProduced;
        averageDataByShift[shift].defectiveItems += production.defectiveItems;
        averageDataByShift[shift].count += 1;
      }
    });
  
    shiftsUnique.forEach(shift => {
      if (averageDataByShift[shift].count > 0) {
        averageDataByShift[shift].productionTime /= averageDataByShift[shift].count;
  
        const totalProduced = averageDataByShift[shift].itemsProduced;
        const defective = averageDataByShift[shift].defectiveItems;
        const success = totalProduced - defective;
  
        averageDataByShift[shift].itemsProduced = (success / totalProduced) * 100; 
        averageDataByShift[shift].defectiveItems = (defective / totalProduced) * 100; 
      }
    });
  
    this.#chartsData.updateRadarChartData(averageDataByShift, shiftsUnique);
  }  
}
