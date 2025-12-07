import { Building2, Users, Calendar, MapPin } from 'lucide-react'

export function StatsBar() {
  const stats = [
    { icon: Building2, label: 'Buildings', value: '550+' },
    { icon: Users, label: 'Architects', value: '200+' },
    { icon: Calendar, label: 'Years Span', value: '1701-2003' },
    { icon: MapPin, label: 'Locations', value: 'Metro Detroit' },
  ]

  return (
    <div className="bg-white border-y border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center justify-center gap-3">
              <stat.icon className="w-5 h-5 text-detroit-green" />
              <div>
                <div className="font-display text-2xl text-detroit-green">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
