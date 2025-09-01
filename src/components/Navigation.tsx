import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, BarChart3, Settings } from "lucide-react";

interface NavigationProps {
  currentView: 'queue' | 'ticket' | 'admin';
  onViewChange: (view: 'queue' | 'ticket' | 'admin') => void;
  hasActiveTicket: boolean;
  isAdmin: boolean;
}

export const Navigation = ({ currentView, onViewChange, hasActiveTicket, isAdmin }: NavigationProps) => {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">Smart Queue</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              <Button
                variant={currentView === 'queue' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('queue')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Queues
              </Button>
              
              {hasActiveTicket && (
                <Button
                  variant={currentView === 'ticket' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('ticket')}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  My Ticket
                  <Badge variant="secondary" className="ml-1">1</Badge>
                </Button>
              )}
              
              {isAdmin && (
                <Button
                  variant={currentView === 'admin' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('admin')}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-success">
              <div className="w-2 h-2 bg-success rounded-full mr-1" />
              Online
            </Badge>
            
            {isAdmin && (
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};