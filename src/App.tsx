import { useState } from 'react'
import './App.css'
import { ELECTION_PHASES } from './lib/constants'

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <header className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-hero text-navy mb-4">CivicIQ</h1>
        <p className="text-lg text-on-surface/80">Your guide to the American electoral process.</p>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {ELECTION_PHASES.map((phase) => (
            <div key={phase.id} className="bg-surface p-6 rounded-lg border border-on-surface/10 hover:border-indigo transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-bold text-indigo uppercase tracking-wider">{phase.duration}</span>
                <span className="bg-emerald/10 text-emerald text-xs px-2 py-1 rounded-full border border-emerald/20">Pending</span>
              </div>
              <h2 className="text-2xl text-navy mb-3">{phase.name}</h2>
              <p className="text-on-surface/70 mb-4">{phase.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {phase.keyActors.map((actor, idx) => (
                  <span key={idx} className="bg-navy/5 text-navy text-xs px-3 py-1 rounded-full">
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
