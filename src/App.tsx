import { Routes, Route } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Timeline } from './pages/Timeline';
const Checklist = () => <div className="p-20">Checklist Page Stub</div>;
const NotFound = () => <div className="p-20 text-center text-3xl">404 - Not Found</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
