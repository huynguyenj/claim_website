import { useState } from 'react';

interface ApprovalItem {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  date: string;
}

function ApprovalPage() {
  const [items, setItems] = useState<ApprovalItem[]>([
    {
      id: '1',
      title: 'Project Proposal A',
      status: 'pending',
      submittedBy: 'John Doe',
      date: '2025-01-15',
    },
    {
      id: '2',
      title: 'Budget Request B',
      status: 'pending',
      submittedBy: 'Jane Smith',
      date: '2025-01-16',
    },
    {
      id: '3',
      title: 'Budget Request C',
      status: 'pending',
      submittedBy: 'Alex Brown',
      date: '2025-01-16',
    },
  ]);

  const handleApprove = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'approved' } : item
    ));
  };

  const handleReject = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Approval Dashboard</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span>Submitted by {item.submittedBy}</span>
                      <span className="mx-2">•</span>
                      <span>{item.date}</span>
                    </div>
                    <span className={`inline-flex mt-2 items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${item.status === 'approved' ? 'bg-green-100 text-green-800' : 
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  
                  {item.status === 'pending' && (
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ApprovalPage;