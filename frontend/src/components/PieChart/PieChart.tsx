import { FC } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

interface IProps {
  statistics: any
}

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart: FC<IProps> = ({ statistics }) => {
  const ageGroups = statistics?.age_groups || {}

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        text: 'Customer Demographics by Age',
        font: {
          size: 18,
        },
      },
    },
  }

  const data = {
    labels: Object.keys(ageGroups),
    datasets: [
      {
        label: 'Customer Demographics by Age',
        data: Object.values(ageGroups),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  return <Pie data={data} width={'320px'} height={'320px'} options={options} />
}

export default PieChart
