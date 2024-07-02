import Chart from 'chart.js/auto'
import comitionsData from '../json_data/comitions.json'

new Chart(
  (document.getElementById('acquisitions') as HTMLCanvasElement),
  {
    type: 'bar',
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
    data: {
      labels: ['Comisiones'],
      datasets: Object.entries(comitionsData).map(([name, value]) => ({
        label: name,
        data: [value]
      }))
    }
  }
);
