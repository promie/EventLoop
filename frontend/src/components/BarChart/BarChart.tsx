import { FC } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

interface IProps {
  statistics: any
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart: FC<IProps> = ({ statistics }) => {
  const sales = statistics?.sales || []

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: 'Summary of Ticket Sales for Events in last 12 months',
        font: {
          size: 18,
        },
      },
    },
  }

  const labels = sales?.map((sale: any) => sale.title)

  const data = {
    labels,
    datasets: [
      {
        label: 'Number of tickets',
        data: sales?.map((sale: any) => sale.total_tickets),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Number of sold tickets',
        data: sales?.map((sale: any) => sale.sold_tickets),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return <Bar options={options} data={data} />
}

export default BarChart
