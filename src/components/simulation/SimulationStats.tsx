'use client';

import React, { useMemo } from 'react';
import { FaMoneyBill, FaGasPump, FaClock, FaRoad } from 'react-icons/fa';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';

export default function SimulationStats() {
  const { uberSimulations } = useStore();
  
  // Cálculos para os cards de resumo usando useMemo para otimização
  const averages = useMemo(() => {
    if (uberSimulations.length === 0) {
      return {
        avgEarningsPerHour: 0,
        avgEarningsPerKm: 0,
        totalNetEarnings: 0,
        totalHours: 0,
        totalDistance: 0,
        totalFuelCost: 0,
        avgConsumption: 0,
      };
    }
    
    const totalNetEarnings = uberSimulations.reduce((sum, sim) => sum + Number(sim.netEarnings), 0);
    const totalHours = uberSimulations.reduce((sum, sim) => sum + Number(sim.hoursWorked), 0);
    const totalDistance = uberSimulations.reduce((sum, sim) => sum + Number(sim.distance), 0);
    const totalFuelCost = uberSimulations.reduce((sum, sim) => sum + Number(sim.fuelCost), 0);
    const totalConsumption = uberSimulations.reduce((sum, sim) => sum + Number(sim.consumption), 0);
    
    // Cálculo de médias
    const avgConsumption = totalConsumption / uberSimulations.length;
    const avgEarningsPerHour = totalNetEarnings / totalHours;
    const avgEarningsPerKm = totalNetEarnings / totalDistance;
    
    return {
      avgEarningsPerHour,
      avgEarningsPerKm,
      totalNetEarnings,
      totalHours,
      totalDistance,
      totalFuelCost,
      avgConsumption,
    };
  }, [uberSimulations]);

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6 mb-6">
      <Card 
        title="Ganho Total Líquido" 
        value={formatCurrency(averages.totalNetEarnings)}
        icon={<FaMoneyBill />}
        color="green"
      />
      
      <Card 
        title="Custo Total Combustível" 
        value={formatCurrency(averages.totalFuelCost)}
        icon={<FaGasPump />}
        color="red"
      />
      
      <Card 
        title="Média por Hora" 
        value={formatCurrency(averages.avgEarningsPerHour)}
        icon={<FaClock />}
        color="blue"
      />
      
      <Card 
        title="Média por Km" 
        value={formatCurrency(averages.avgEarningsPerKm)}
        icon={<FaRoad />}
        color="purple"
      />
      
      <Card 
        title="Total de Horas" 
        value={`${formatNumber(averages.totalHours, 1)}h`}
        icon={<FaClock />}
        color="blue"
      />
      
      <Card 
        title="Total de Distância" 
        value={`${formatNumber(averages.totalDistance, 1)} km`}
        icon={<FaRoad />}
        color="purple"
      />
      
      <Card 
        title="Média Consumo" 
        value={`${formatNumber(averages.avgConsumption, 1)} km/l`}
        icon={<FaGasPump />}
        color="cyan"
      />
      
      <Card 
        title="Total de Simulações" 
        value={uberSimulations.length.toString()}
        icon={<FaMoneyBill />}
        color="gray"
      />
    </div>
  );
} 