import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, AlertTriangle } from "lucide-react";

interface QueueCardProps {
  id: string;
  name: string;
  currentNumber: number;
  waitingCount: number;
  avgWaitTime: number;
  isActive: boolean;
  onJoinQueue: (queueId: string, isPriority?: boolean) => void;
}

export const QueueCard = ({
  id,
  name,
  currentNumber,
  waitingCount,
  avgWaitTime,
  isActive,
  onJoinQueue,
}: QueueCardProps) => {
  return (
    <Card className="hover:shadow-medium transition-all duration-300 animate-slide-up">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Closed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">#{currentNumber}</div>
            <span className="text-muted-foreground">Now serving</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{waitingCount} waiting</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>~{avgWaitTime} min</span>
          </div>
        </div>

        {isActive && (
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onJoinQueue(id)} 
              className="flex-1 bg-gradient-primary hover:shadow-soft"
              size="sm"
            >
              Join Queue
            </Button>
            <Button 
              onClick={() => onJoinQueue(id, true)} 
              variant="outline"
              size="sm"
              className="border-queue-priority text-queue-priority hover:bg-queue-priority hover:text-white"
            >
              <AlertTriangle className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};