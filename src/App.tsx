import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/Home'
import { CharacterList } from './pages/CharacterList'
import { CharacterCreator } from './pages/CharacterCreator'
import { CharacterSheet } from './pages/CharacterSheet'

export function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personajes" element={<CharacterList />} />
        <Route path="/personajes/nuevo" element={<CharacterCreator />} />
        <Route path="/personajes/:id" element={<CharacterSheet />} />
      </Routes>
    </div>
  )
}
