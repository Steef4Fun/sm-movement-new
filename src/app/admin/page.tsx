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
  const { profile } = useAuth();

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
            <strong>Email:</strong> {profile?.email}
          </p>
          <p>
            <strong>Gebruiker ID:</strong> {profile?.id}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}