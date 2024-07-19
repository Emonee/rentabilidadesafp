import Chart from 'chart.js/auto'
import anualData from '../../json_data/anual.json'

let fondo: 'A' | 'B' | 'C' | 'D' | 'E' = 'A'
const firstYear = 2005
const actualYear = new Date().getFullYear()
const years = [...Array(actualYear - firstYear).keys()].map(i => firstYear + i)
let chart: Chart | null = null
generateChart()
document.querySelector<HTMLSelectElement>('#fondo')?.addEventListener('change', (event) => {
  const value = (event.target as HTMLSelectElement)?.value as typeof fondo
  fondo = value
  if (chart) {
    chart.data.datasets = generateData()
    chart.update()
  }
})

function generateChart() {
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
      ctx.strokeStyle = 'rgba(180, 0, 0, 0.3)'; // Set line color (red, with 70% opacity)
      ctx.stroke();
      ctx.restore();
    }
  };
  chart = new Chart(
    (document.getElementById('anual') as HTMLCanvasElement),
    {
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
        datasets: generateData()
      },
      plugins: [zeroLinePlugin]
    }
  );
}

function generateData () {
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
