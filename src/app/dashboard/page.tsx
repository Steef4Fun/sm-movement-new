"use client";

import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4">
        Welkom bij uw Dashboard
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Account Informatie</CardTitle>
          <CardDescription>
            Hieronder ziet u uw huidige accountgegevens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Gebruiker ID:</strong> {user?.id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}