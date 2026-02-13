import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Loading from './components/common/Loading'

// Lazy loading para mejorar el rendimiento
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Workouts = React.lazy(() => import('./pages/Workouts'))
const Exercises = React.lazy(() => import('./pages/Exercises'))
const Routines = React.lazy(() => import('./pages/Routines'))
const RoutineDetail = React.lazy(() => import('./pages/RoutineDetail'))
const WorkoutDetail = React.lazy(() => import('./pages/WorkoutDetail'))
const Progress = React.lazy(() => import('./pages/Progress'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="exercises" element={<Exercises />} />
          <Route path="routines" element={<Routines />} />
          <Route path="routines/:id" element={<RoutineDetail />} />
          <Route path="history/:id" element={<WorkoutDetail />} />
          <Route path="progress" element={<Progress />} />
          {/* Ruta 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
