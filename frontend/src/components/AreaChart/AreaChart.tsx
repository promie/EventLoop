import { FC } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

interface IProps {
  statistics: any
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
)

const AreaChart: FC<IProps> = ({ statistics }) => {
  const monthlyIncome = statistics?.monthly_income || {}

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
        text: 'Summary of Monthly Income over last 12 months (in AUD)',
        font: {
          size: 18,
        },
      },
    },
  }

  const data = {
    labels: Object.keys(monthlyIncome),
    datasets: [
      {
        fill: true,
        label: '$ Amount',
        data: Object.values(monthlyIncome),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return <Line options={options} data={data} />
}

export default AreaChart
