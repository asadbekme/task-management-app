import { Card, CardContent } from "./ui/card";

interface EmptyStateCardProps {
  message: string;
}

export const EmptyStateCard = ({ message }: EmptyStateCardProps) => (
  <Card>
    <CardContent className="text-center py-12">
      <p className="text-gray-500">{message}</p>
    </CardContent>
  </Card>
);
