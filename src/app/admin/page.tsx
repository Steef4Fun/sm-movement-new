"use client";

import { useEffect, useState } from "react";
import * as api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Car, Calendar, FileText, Activity } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";

type StatCardProps = {
  title: string;
  value: number | string;
  icon: React.ElementType;
  loading: boolean;
};

const StatCard = ({ title, value, icon: Icon, loading }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-8 w-1/2" />
      ) : (
        <div className="text-2xl font-bold">{value}</div>
      )}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    pendingAppointments: 0,
    pendingQuotes: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [users, listings, appointments, quotes] = await Promise.all([
          api.getAllUsers(),
          api.getListings(),
          api.getAppointments(),
          api.getQuotes(),
        ]);

        setStats({
          totalUsers: users.length,
          activeListings: listings.filter((l: any) => l.status === 'beschikbaar').length,
          pendingAppointments: appointments.filter((a: any) => a.status === 'in afwachting').length,
          pendingQuotes: quotes.filter((q: any) => q.status === 'in afwachting').length,
        });

        const combinedActivity = [
          ...appointments.map((a: any) => ({ ...a, type: 'afspraak', date: a.created_at })),
          ...quotes.map((q: any) => ({ ...q, type: 'offerte', date: q.created_at })),
        ];

        combinedActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivity(combinedActivity.slice(0, 5));

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welkom terug, {profile?.first_name || "Admin"}!
        </h1>
        <p className="text-muted-foreground">
          Hier is een overzicht van uw platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Totaal Klanten" value={stats.totalUsers} icon={Users} loading={loading} />
        <StatCard title="Actieve Aanbod" value={stats.activeListings} icon={Car} loading={loading} />
        <StatCard title="Openstaande Afspraken" value={stats.pendingAppointments} icon={Calendar} loading={loading} />
        <StatCard title="Openstaande Offertes" value={stats.pendingQuotes} icon={FileText} loading={loading} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5" />
            Recente Activiteit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <TableRow key={`${item.type}-${item.id}`}>
                    <TableCell>
                      <div className="font-medium">
                        Nieuwe {item.type}: {item.subject || item.service_type}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Klant: {item.user?.email || 'Onbekend'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center">Geen recente activiteit.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}