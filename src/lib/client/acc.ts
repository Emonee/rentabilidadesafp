import Chart from 'chart.js/auto'
import ytdAccData from '../../json_data/ytd_acc.json'

(async function() {
  const fondos = Object.keys(Object.values(ytdAccData)[0])
  const datasets = Object.entries(ytdAccData).map(([name, values]) => ({
    label: name,
    data: Object.values(values).map((v) => v.acc)
  }))
  new Chart(
    (document.getElementById('acc') as HTMLCanvasElement),
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
        labels: fondos,
        datasets
      }
    }
  );
})();
