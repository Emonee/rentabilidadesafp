import { BaseChart } from "@/components/charts/base/base";
import anualData from '@/json_data/anual.json'
import type { Chart } from "chart.js";
import type { Fondo } from '@/lib/utilities/types/index'

const actualYear = new Date().getFullYear()
const firstYear = 2005

export class AnnualChart extends BaseChart {
  constructor() {
    super()
    const zeroLinePlugin = {
      id: 'zeroLine', // Custom ID for the plugin
      beforeDatasetsDraw(chart: Chart) {
        const yScale = chart.scales['y'];
        const ctx = chart.ctx;
        const yValue = yScale.getPixelForValue(0); // Get the pixel value for zero on the Y-axis
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(chart.chartArea.left, yValue); // Start drawing from the left of the chart
        ctx.lineTo(chart.chartArea.right, yValue); // Draw to the right of the chart
        ctx.lineWidth = 2; // Set line width
        ctx.strokeStyle = 'rgba(180, 0, 0, 0.3)'; // Set line color
        ctx.stroke();
        ctx.restore();
      }
    }
    const years = [...Array(actualYear - firstYear).keys()].map(i => firstYear + i)
    this.drawChart(this, {
      type: 'line',
      options: {
        interaction: {
          mode: 'nearest',
          intersect: false,
          axis: 'x'
        },
        scales: {
          y: {
            min: -50,
            max: 50
          }
        }
      },
      data: {
        labels: years,
        datasets: this.generateData('A')
      },
      plugins: [zeroLinePlugin]
    })
    this.querySelector<HTMLSelectElement>('select')?.addEventListener('change', (event) => {
      const newSelectedFondo = (event.target as HTMLSelectElement)?.value as Fondo
      this.updateDatasets(this.generateData(newSelectedFondo))
    })
  }
  generateData(fondo: Fondo) {
    const datasets = Object.entries(anualData).map(([name, values]) => {
      const firstYearAfp = Object.keys(values)[0]
      const yearDiff = +firstYearAfp - firstYear
      return {
        label: name,
        data: [...Array(yearDiff).fill(null), ...Object.values(values).map((v) => v[fondo])],
        tension: 0.2
      }
    })
    return datasets
  }
}
customElements.define('annual-chart', AnnualChart);
