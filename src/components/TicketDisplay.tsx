import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Bell, X } from "lucide-react";

interface TicketDisplayProps {
  ticketNumber: number;
  queueName: string;
  currentNumber: number;
  estimatedWait: number;
  position: number;
  isPriority: boolean;
  notificationEnabled: boolean;
  onToggleNotification: () => void;
  onLeaveQueue: () => void;
}

export const TicketDisplay = ({
  ticketNumber,
  queueName,
  currentNumber,
  estimatedWait,
  position,
  isPriority,
  notificationEnabled,
  onToggleNotification,
  onLeaveQueue,
}: TicketDisplayProps) => {
  const isNext = position <= 2;
  const isNow = position === 0;

  return (
    <Card className={`transition-all duration-500 ${isNext ? 'animate-pulse-glow border-primary' : ''}`}>
      <CardHeader className="text-center pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{queueName}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onLeaveQueue}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {isPriority && (
          <Badge className="bg-queue-priority text-white w-fit mx-auto">
            Priority
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="text-center space-y-6">
        <div className="space-y-2">
          <div className="text-6xl font-bold text-primary">#{ticketNumber}</div>
          <p className="text-muted-foreground">Your ticket number</p>
        </div>

        {isNow ? (
          <div className="p-4 bg-gradient-secondary rounded-lg text-white">
            <div className="text-xl font-semibold">It's your turn!</div>
            <p className="text-sm opacity-90">Please proceed to the counter</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">#{currentNumber}</div>
                <p className="text-xs text-muted-foreground">Now serving</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-warning">{position}</div>
                <p className="text-xs text-muted-foreground">Ahead of you</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">{estimatedWait}</div>
                <p className="text-xs text-muted-foreground">Min wait</p>
              </div>
            </div>

            {isNext && (
              <div className="p-3 bg-gradient-primary rounded-lg text-white">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Get ready! You're next</span>
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          variant={notificationEnabled ? "default" : "outline"}
          onClick={onToggleNotification}
          className="w-full"
        >
          <Bell className="h-4 w-4 mr-2" />
          {notificationEnabled ? "Notifications ON" : "Enable Notifications"}
        </Button>
      </CardContent>
    </Card>
  );
};