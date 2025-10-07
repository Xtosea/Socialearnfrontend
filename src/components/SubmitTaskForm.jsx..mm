import { useState } from 'react';
import api from '../api/api';

export default function SubmitTaskForm() {
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState(30);
  const [pointsPerView, setPointsPerView] = useState(5);
  const [totalFund, setTotalFund] = useState(50);

  async function submit(e) {
    e.preventDefault();
    await api.post('/tasks/video', { url, duration, pointsPerView, totalPointsFund: totalFund });
    alert('Submitted — awaiting approval');
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded max-w-xl">
      <h3 className="mb-2">Submit Video</h3>
      <input placeholder="Video URL" value={url} onChange={e => setUrl(e.target.value)} required className="w-full mb-2 p-2 border" />
      <label className="block mb-2">Duration
        <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full p-2 border">
          {[30,60,120,190,360].map(d => <option key={d} value={d}>{d}s</option>)}
        </select>
      </label>
      <input placeholder="Points per view" type="number" value={pointsPerView} onChange={e => setPointsPerView(Number(e.target.value))} required className="w-full mb-2 p-2 border" />
      <input placeholder="Total fund" type="number" value={totalFund} onChange={e => setTotalFund(Number(e.target.value))} required className="w-full mb-2 p-2 border" />
      <button className="btn bg-blue-600 text-white px-4 py-2 rounded" type="submit">Submit</button>
    </form>
  );
}