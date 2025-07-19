import { Component, Input } from '@angular/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CompanyWiseSales } from '../../../models/CompanyWiseIncomeQueryResponse';
@Component({
  selector: 'app-monthwise',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './monthwise.component.html',
  styleUrl: './monthwise.component.scss'
})
export class MonthwiseComponent {


  //    @Input() companyWiseData: CompanyWiseSales[] = []; 


  //  public barChartLabels: string[] = ['Company A', 'Company B', 'Company C', 'Company D'];

  //   public barChartData: ChartDataset<'bar'>[] = [
  //     {
  //       data: [120000, 95000, 78000, 112000],
  //       label: 'Income',
  //       yAxisID: 'y1',
  //       backgroundColor: 'rgba(99, 255, 143, 0.6)'
  //     },
  //     {
  //       data: [40, 60, 50, 70],
  //       label: 'Quantity',
  //       yAxisID: 'y2',
  //       backgroundColor: 'rgba(255,99,132,0.6)'
  //     }
  //   ];

  //   public barChartOptions: ChartOptions<'bar'> = {
  //     responsive: true,
  //     scales: {
  //       y1: {
  //         beginAtZero: true,
  //         position: 'left',
  //         title: { display: true, text: 'Income' }
  //       },
  //       y2: {
  //         beginAtZero: true,
  //         position: 'right',
  //         grid: { drawOnChartArea: false },
  //         title: { display: true, text: 'Quantity' }
  //       }
  //     }
  //   };

  //   public barChartType: 'bar' = 'bar';

  @Input() companyWiseData: CompanyWiseSales[] = [];

  public barChartLabels: string[] = [];
  public barChartData: ChartDataset<'bar'>[] = [];

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y1: {
        beginAtZero: true,
        position: 'left',
        title: { display: true, text: 'Income' }
      },
      y2: {
        beginAtZero: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Quantity' }
      }
    }
  };

  public barChartType: 'bar' = 'bar';

  ngOnChanges(): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    if (!this.companyWiseData || this.companyWiseData.length === 0) {
      return;
    }

    this.barChartLabels = this.companyWiseData.map(c => c.companyName);

    const incomeData = this.companyWiseData.map(c => c.totalNetTotal);
    const quantityData = this.companyWiseData.map(c => c.totalQuantity);

    this.barChartData = [
      {
        data: incomeData,
        label: 'Income',
        yAxisID: 'y1',
        backgroundColor: 'rgba(99, 255, 143, 0.6)'
      },
      {
        data: quantityData,
        label: 'Quantity',
        yAxisID: 'y2',
        backgroundColor: 'rgba(255, 99, 132, 0.6)'
      }
    ];
  }

}
