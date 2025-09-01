import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { QueueCard } from "@/components/QueueCard";
import { TicketDisplay } from "@/components/TicketDisplay";
import { AdminDashboard } from "@/components/AdminDashboard";
import { useToast } from "@/hooks/use-toast";
import type { Queue, Ticket, QueueStats } from "@/types/queue";

// Mock data - in real app this would come from backend
const initialQueues: Queue[] = [
  {
    id: "1",
    name: "General Reception",
    currentNumber: 15,
    waitingCount: 8,
    avgWaitTime: 12,
    isActive: true,
    location: "Counter A"
  },
  {
    id: "2", 
    name: "Emergency Services",
    currentNumber: 3,
    waitingCount: 2,
    avgWaitTime: 5,
    isActive: true,
    location: "Counter B"
  },
  {
    id: "3",
    name: "Specialist Consultation", 
    currentNumber: 7,
    waitingCount: 12,
    avgWaitTime: 25,
    isActive: true,
    location: "Counter C"
  },
  {
    id: "4",
    name: "Pharmacy Counter",
    currentNumber: 22,
    waitingCount: 5,
    avgWaitTime: 8,
    isActive: true,
    location: "Counter D"
  }
];

const Index = () => {
  const [currentView, setCurrentView] = useState<'queue' | 'ticket' | 'admin'>('queue');
  const [queues, setQueues] = useState<Queue[]>(initialQueues);
  const [userTicket, setUserTicket] = useState<Ticket | null>(null);
  const [isAdmin] = useState(true); // Toggle for demo
  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueues(prev => prev.map(queue => ({
        ...queue,
        currentNumber: queue.currentNumber + Math.random() > 0.7 ? 1 : 0,
        waitingCount: Math.max(0, queue.waitingCount + (Math.random() > 0.5 ? -1 : 1))
      })));

      // Update user ticket position
      if (userTicket) {
        setUserTicket(prev => {
          if (!prev) return null;
          const newPosition = Math.max(0, prev.position - (Math.random() > 0.7 ? 1 : 0));
          
          if (newPosition === 0 && prev.position > 0) {
            toast({
              title: "It's your turn!",
              description: `Please proceed to ${prev.queueName}`,
            });
          } else if (newPosition <= 2 && prev.position > 2) {
            toast({
              title: "Get ready!",
              description: "You're next in line",
            });
          }
          
          return {
            ...prev,
            position: newPosition,
            estimatedWait: newPosition * 3
          };
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [userTicket, toast]);

  const handleJoinQueue = (queueId: string, isPriority = false) => {
    const queue = queues.find(q => q.id === queueId);
    if (!queue) return;

    const newTicketNumber = queue.currentNumber + queue.waitingCount + 1;
    const position = isPriority ? Math.floor(queue.waitingCount / 2) : queue.waitingCount;
    
    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      number: newTicketNumber,
      queueId: queue.id,
      queueName: queue.name,
      isPriority,
      createdAt: new Date(),
      estimatedWait: position * queue.avgWaitTime / queue.waitingCount || queue.avgWaitTime,
      position,
      notificationEnabled: false
    };

    setUserTicket(ticket);
    setCurrentView('ticket');
    
    // Update queue waiting count
    setQueues(prev => prev.map(q => 
      q.id === queueId 
        ? { ...q, waitingCount: q.waitingCount + 1 }
        : q
    ));

    toast({
      title: "Ticket generated!",
      description: `Your ticket #${newTicketNumber} for ${queue.name}`,
    });
  };

  const handleLeaveQueue = () => {
    if (userTicket) {
      setQueues(prev => prev.map(q => 
        q.id === userTicket.queueId 
          ? { ...q, waitingCount: Math.max(0, q.waitingCount - 1) }
          : q
      ));
      setUserTicket(null);
      setCurrentView('queue');
      toast({
        title: "Left queue",
        description: "You have successfully left the queue",
      });
    }
  };

  const handleToggleNotification = () => {
    if (userTicket) {
      setUserTicket(prev => prev ? {
        ...prev,
        notificationEnabled: !prev.notificationEnabled
      } : null);
      
      toast({
        title: userTicket.notificationEnabled ? "Notifications disabled" : "Notifications enabled",
        description: userTicket.notificationEnabled 
          ? "You won't receive alerts" 
          : "We'll notify you when it's almost your turn",
      });
    }
  };

  const stats: QueueStats = {
    totalServed: 245,
    avgWaitTime: 14,
    activeQueues: queues.filter(q => q.isActive).length,
    peakHour: "1:00 PM"
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        hasActiveTicket={!!userTicket}
        isAdmin={isAdmin}
      />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'queue' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Smart Queue System</h1>
              <p className="text-muted-foreground">Join a queue and track your wait time in real-time</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {queues.map((queue) => (
                <QueueCard
                  key={queue.id}
                  {...queue}
                  onJoinQueue={handleJoinQueue}
                />
              ))}
            </div>
          </div>
        )}

        {currentView === 'ticket' && userTicket && (
          <div className="max-w-md mx-auto">
            <TicketDisplay
              ticketNumber={userTicket.number}
              queueName={userTicket.queueName}
              currentNumber={queues.find(q => q.id === userTicket.queueId)?.currentNumber || 0}
              estimatedWait={userTicket.estimatedWait}
              position={userTicket.position}
              isPriority={userTicket.isPriority}
              notificationEnabled={userTicket.notificationEnabled}
              onToggleNotification={handleToggleNotification}
              onLeaveQueue={handleLeaveQueue}
            />
          </div>
        )}

        {currentView === 'admin' && isAdmin && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Monitor queue performance and analytics</p>
            </div>
            
            <AdminDashboard {...stats} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
