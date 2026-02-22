import { useNavigate } from 'react-router-dom'
import { Search, Plus, GitCompareArrows } from 'lucide-react'
import Card from '../shared/Card'

const actions = [
  {
    label: 'New Search',
    desc: 'Find your perfect strain',
    icon: Search,
    route: '/',
    color: 'bg-leaf-500/10 text-leaf-400',
  },
  {
    label: 'Add Journal Entry',
    desc: 'Log an experience',
    icon: Plus,
    route: '/journal',
    color: 'bg-indica-500/10 text-indica-400',
  },
  {
    label: 'Compare Strains',
    desc: 'Side-by-side comparison',
    icon: GitCompareArrows,
    route: '/compare',
    color: 'bg-sativa-500/10 text-sativa-400',
  },
]

export default function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map(({ label, desc, icon: Icon, route, color }) => (
        <Card
          key={route}
          hoverable
          onClick={() => navigate(route)}
          className="p-4 text-center space-y-2"
        >
          <div
            className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${color} mx-auto`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
            {label}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-[#6a7a6e] leading-tight hidden sm:block">
            {desc}
          </p>
        </Card>
      ))}
    </div>
  )
}
