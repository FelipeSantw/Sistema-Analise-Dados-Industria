import { DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import machinesData from '../../../assets/mockdata/machines.json';
import productionData from '../../../assets/mockdata/production.json';
import { SelectComponent } from './select.components';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}
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
  productionDate: number; // timestamp in milliseconds
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
  public machines: Machine[] = machinesData;
  public productions: Production[] = productionData;
  public selectedMachineId: number | null = null;
  public selectedProductions: Production[] = [];

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/images/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/images/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/images/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/images/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/images/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/images/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];

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
  }

  initCharts(): void {
    this.mainChart = this.#chartsData.mainChart;
    this.chartBarData = this.#chartsData.chartBarData;
    this.chartDoughnutData = this.#chartsData.chartDoughnutData;
    this.chartPieData = this.#chartsData.chartPieData;
    this.chartPolarAreaData = this.#chartsData.chartPolarAreaData;
    this.chartRadarData = this.#chartsData.chartRadarData;
  }

  setTrafficPeriod(value: 'machines' | 'production'): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.#chartsData.initCharts(value);
    this.initCharts();
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

    // Filtra produções com base no machineId selecionado
    this.selectedProductions = this.productions.filter(
      production => production.machineId === this.selectedMachineId
    );

    console.log('Selected Productions:', this.selectedProductions);

    // Processa a data e os outros dados
    this.selectedProductions.forEach(production => {
      const productionDate = new Date(production.productionDate).toLocaleDateString();
      console.log(`Production ID: ${production.id}, Date: ${productionDate}`);
      // Adicione outros processamentos conforme necessário
    });
  }
}
