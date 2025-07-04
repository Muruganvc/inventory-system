import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CompanyGroup, ProductSummary } from '../../../models/ProductSummary';

@Component({
  selector: 'app-company-wise-income',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-wise-income.component.html',
  styleUrl: './company-wise-income.component.scss'
})
export class CompanyWiseIncomeComponent {

  rawData: ProductSummary[] = [
    { company: 'ElectraTech', category: 'Indicator', product: 'ElectraTech Indicator', quantity: 32, income: 6400 },
    { company: 'FireBoss Electrical', category: 'Indicator', product: 'LED', quantity: 83, income: 3036 },
    { company: 'FireBoss Electrical', category: 'Voltage Regulators', product: 'FireBoss Electrical Voltage Regulators', quantity: 67, income: 1164 },
    { company: 'GM Electric', category: 'Fan', product: 'CEILING', quantity: 67, income: 378929 },
    { company: 'GM Electric', category: 'Indicator', product: 'GM Electric Indicator', quantity: 32, income: 9952 },
    { company: 'GM Electric', category: 'MCB', product: 'GM Electric MCB', quantity: 32, income: 64 },
    { company: 'HiFi Electronics', category: 'Switch', product: '5A', quantity: 45, income: 554512 },
    { company: 'Lisha Electric', category: 'Circuit Breakers', product: 'Lisha Electric Circuit Breakers', quantity: 23, income: 78959 },
    { company: 'Lisha Electric', category: 'Fan', product: 'Ceiling Fan', quantity: 111, income: 3256 },
    { company: 'Lisha Electric', category: 'Indicator', product: 'LED Indicator', quantity: 71, income: 791 },
    { company: 'Lisha Electric', category: 'MCB', product: '10A MCB', quantity: 23, income: 2231 },
    { company: 'Lisha Electric', category: 'Sockets', product: '5 PIN', quantity: 111, income: 4337 },
    { company: 'Lisha Electric', category: 'Switch', product: '10A Switch', quantity: 156, income: 5336 },
    { company: 'Lisha Electric', category: 'Switch', product: '5A Switch', quantity: 96, income: 1814 },
    { company: 'Lisha Electric', category: 'Wires', product: '1.5', quantity: 23, income: 15571 },
    { company: 'Lisha', category: 'Wires', product: '1.5', quantity: 23, income: 15571 }
  ];

  companyData: CompanyGroup[] = [];

  ngOnInit(): void {
  const map = new Map<
    string,
    Map<
      string,
      {
        totalQuantity: number;
        totalIncome: number;
        products: { name: string; quantity: number; income: number }[];
      }
    >
  >();

  this.rawData.forEach(item => {
    if (!map.has(item.company)) map.set(item.company, new Map());
    const categoryMap = map.get(item.company)!;

    if (!categoryMap.has(item.category)) {
      categoryMap.set(item.category, {
        totalQuantity: 0,
        totalIncome: 0,
        products: []
      });
    }

    const entry = categoryMap.get(item.category)!;
    entry.totalQuantity += item.quantity;
    entry.totalIncome += item.income;

    // Group by product inside category
    const existingProduct = entry.products.find(p => p.name === item.product);
    if (existingProduct) {
      existingProduct.quantity += item.quantity;
      existingProduct.income += item.income;
    } else {
      entry.products.push({
        name: item.product,
        quantity: item.quantity,
        income: item.income
      });
    }
  });

  this.companyData = Array.from(map.entries()).map(([company, categories]) => {
    const topCategories = Array.from(categories.entries())
      .map(([category, values]) => ({
        category,
        totalQuantity: values.totalQuantity,
        totalIncome: values.totalIncome,
        products: values.products
      }))
      .sort((a, b) => b.totalIncome - a.totalIncome)
      .slice(0, 5);

    return {
      company,
      bgColor: this.getRandomColor(),
      categories: topCategories
    };
  });
}


  getRandomColor(): string {
    const gradients = [
      'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
      'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
      'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
      'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  }
}
