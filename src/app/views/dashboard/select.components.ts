import { Component, OnInit } from '@angular/core';
import machinesData from '../../../assets/mockdata/machines.json';
import productionData from '../../../assets/mockdata/production.json';

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
  selector: 'app-select-machine',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class SelectComponent implements OnInit {

  machines: Machine[] = machinesData;
  productions: Production[] = productionData;
  selectedMachineId: number | null = null;
  selectedProductions: Production[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loadMachines();
  }

  loadMachines(): void {
    // Log the machines to verify the data is being loaded
    console.log('Machines loaded:', this.machines);
  }

  onMachineSelect(event: Event): void {
    const machineId = Number((event.target as HTMLSelectElement).value);
    this.selectedMachineId = machineId;

    // Log the selected machine ID
    console.log('Selected Machine ID:', this.selectedMachineId);

    // Filter productions based on selected machine ID
    this.selectedProductions = this.productions.filter(
      production => production.machineId === this.selectedMachineId
    );

    // Log the selected productions
    console.log('Selected Productions:', this.selectedProductions);

    // Process production data (convert productionDate to a readable format)
    this.selectedProductions.forEach(production => {
      const productionDate = new Date(production.productionDate).toLocaleDateString();
      console.log(`Production ID: ${production.id}, Date: ${productionDate}`);
      // You can save or manipulate the data as required
    });
  }
}
