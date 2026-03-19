import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

type TableStatus = 'available' | 'occupied' | 'eating' | 'paying';

export type SimulatedTable = {
  id: number;
  capacity: number;
  isVip: boolean;
  status: TableStatus;
  guestName?: string;
  groupSize?: number;
  timer?: number; // Internal timer to track state transitions
  orderId?: string;
};

export type SimulatedOrder = {
  id: string;
  tableId: number;
  items: string[];
  total: number;
  timeOrdered: Date;
  status: 'pending' | 'cooking' | 'served';
  minutos: number; // For dashboard display
  tipo: 'Salon' | 'VIP';
};

export type Receipt = {
  id: string;
  tableId: number;
  guestName: string;
  items: string[];
  subtotal: number;
  tip: number;
  total: number;
  timePaid: Date;
};

export type SimulationKpis = {
  revenue: number;
  tips: number;
  servedCustomers: number;
  wok1Time: number;
  wok2Time: number;
};

interface SimulationContextType {
  isRunning: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  resetSimulation: () => void;
  tables: SimulatedTable[];
  activeOrders: SimulatedOrder[];
  receipts: Receipt[];
  kpis: SimulationKpis;
  waitingQueue: number;
}

export const CUSTOMER_POOL = [
  'Carlos S.', 'María G.', 'Elena V.', 'James B.', 'Sofia R.', 'Miguel A.', 'Lucía N.', 'David C.', 'Ana M.', 'Jorge L.',
  'Emma W.', 'Oliver T.', 'Isabella Martinez', 'Liam P.', 'Mia G.', 'Noah R.', 'Ava B.', 'Elijah C.', 'Charlotte K.', 'William M.',
  'Alejandro F.', 'Valeria P.', 'Santiago D.', 'Catalina H.', 'Mateo J.', 'Victoria S.', 'Sebastián V.', 'Camila O.', 'Emilio G.', 'Julia R.'
];

const FOOD_ITEMS = [
  { name: 'Pato Pekín Imperial', price: 149.99 },
  { name: 'Arroz Frito Especial', price: 45.00 },
  { name: 'Dim Sum Surtido', price: 38.50 },
  { name: 'Pollo Kung Pao', price: 42.00 },
  { name: 'Cerdo Agridulce', price: 40.00 },
  { name: 'Fideos Chow Mein', price: 35.00 },
  { name: 'Sopa de Aleta de Tiburón (Falsa)', price: 55.00 },
  { name: 'Rollo de Primavera Vegano', price: 25.00 }
];

const INITIAL_TABLES: SimulatedTable[] = [
  { id: 1, capacity: 2, isVip: true, status: 'available' },
  { id: 2, capacity: 2, isVip: true, status: 'available' },
  { id: 3, capacity: 4, isVip: true, status: 'available' },
  { id: 4, capacity: 6, isVip: true, status: 'available' },
  { id: 5, capacity: 2, isVip: false, status: 'available' },
  { id: 6, capacity: 2, isVip: false, status: 'available' },
  { id: 7, capacity: 2, isVip: false, status: 'available' },
  { id: 8, capacity: 4, isVip: false, status: 'available' },
  { id: 9, capacity: 4, isVip: false, status: 'available' },
  { id: 10, capacity: 4, isVip: false, status: 'available' },
  { id: 11, capacity: 4, isVip: false, status: 'available' },
  { id: 12, capacity: 6, isVip: false, status: 'available' },
  { id: 13, capacity: 8, isVip: false, status: 'available' },
  { id: 14, capacity: 10, isVip: false, status: 'available' },
];

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false);
  const [waitingQueue, setWaitingQueue] = useState<string[]>([]);
  const [tables, setTables] = useState<SimulatedTable[]>(INITIAL_TABLES);
  const [activeOrders, setActiveOrders] = useState<SimulatedOrder[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [kpis, setKpis] = useState<SimulationKpis>({
    revenue: 0,
    tips: 0,
    servedCustomers: 0,
    wok1Time: 0,
    wok2Time: 0,
  });

  const tickRef = useRef<number | null>(null);

  const startSimulation = () => {
    if (waitingQueue.length === 0 && tables.every(t => t.status === 'available')) {
      // Initialize 30 people queue
      setWaitingQueue([...CUSTOMER_POOL].sort(() => 0.5 - Math.random()));
    }
    setIsRunning(true);
  };

  const stopSimulation = () => setIsRunning(false);

  const resetSimulation = () => {
    setIsRunning(false);
    setWaitingQueue([]);
    setTables(INITIAL_TABLES);
    setActiveOrders([]);
    setReceipts([]);
    setKpis({ revenue: 0, tips: 0, servedCustomers: 0, wok1Time: 0, wok2Time: 0 });
  };

  const generateOrder = (table: SimulatedTable) => {
    const numItems = Math.floor(Math.random() * table.groupSize!) + 1; // 1 to groupSize items
    const items = [];
    let total = 0;
    for(let i=0; i<numItems; i++) {
        const food = FOOD_ITEMS[Math.floor(Math.random() * FOOD_ITEMS.length)];
        items.push(food.name);
        total += food.price;
    }
    return { items, total };
  };

  const tick = useCallback(() => {
    setTables(prevTables => {
      const nextTables = [...prevTables];
      let ordersToAdd: SimulatedOrder[] = [];
      let updatedKpis = { ...kpis };

      // 1. Progress State of currently occupied tables
      for (let i = 0; i < nextTables.length; i++) {
        const table = nextTables[i];
        if (table.status !== 'available') {
          table.timer = (table.timer || 0) + 1; // 1 second = 1 tick

          if (table.status === 'occupied' && table.timer >= 2) {
            // After 2 ticks, they order food
            table.status = 'eating';
            table.timer = 0;
            const { items, total } = generateOrder(table);
            const orderId = `CMD-${Math.floor(Math.random()*10000)}`;
            table.orderId = orderId;
            
            ordersToAdd.push({
              id: orderId,
              tableId: table.id,
              items,
              total,
              timeOrdered: new Date(),
              status: 'pending',
              minutos: 0,
              tipo: table.isVip ? 'VIP' : 'Salon'
            });

            // Simulate Wok stress
            updatedKpis.wok1Time += Math.floor(Math.random() * 5);
            updatedKpis.wok2Time += Math.floor(Math.random() * 5);

          } else if (table.status === 'eating' && table.timer >= 10) {
            // After 10 ticks eating, they ask for bill
            table.status = 'paying';
            table.timer = 0;

          } else if (table.status === 'paying' && table.timer >= 3) {
            // After 3 ticks paying, they leave
            
            // Find their total from active orders (or calculate)
            // For simplicity, we stored it in activeOrders but we need it here. We'll find it or recalculate if missing.
            // We need to trigger receipt generation.
            table.status = 'available';
            table.timer = 0;
            updatedKpis.servedCustomers += table.groupSize || 0;
            table.guestName = undefined;
            table.groupSize = undefined;
            table.orderId = undefined;
          }
        }
      }

      // 2. Try to seat people from the queue
      setWaitingQueue(prevQueue => {
        const nextQueue = [...prevQueue];
        if (nextQueue.length > 0 && Math.random() > 0.4) { // 60% chance to seat someone per tick if waiting
            // Find a table
            // Random group size 1 to 4
            const groupSize = Math.floor(Math.random() * 4) + 1;
            const suitableTableIndex = nextTables.findIndex(t => t.status === 'available' && t.capacity >= groupSize);
            
            if (suitableTableIndex !== -1) {
                const guestName = nextQueue.shift()!;
                nextTables[suitableTableIndex] = {
                    ...nextTables[suitableTableIndex],
                    status: 'occupied',
                    guestName: guestName,
                    groupSize: groupSize,
                    timer: 0
                };
            }
        }
        return nextQueue;
      });

      // Update Orders & KPIs
      if (ordersToAdd.length > 0) {
        setActiveOrders(prev => [...prev, ...ordersToAdd]);
        setKpis(updatedKpis); // apply wok times
      }

      return nextTables;
    });

    // Separately manage active orders timers and completions
    setActiveOrders(prevOrders => {
      let nextOrders = [...prevOrders];
      let completedOrderTotals = 0;
      let receiptsToAdd: Receipt[] = [];

      for (let i = nextOrders.length - 1; i >= 0; i--) {
        nextOrders[i].minutos += 1; // 1 min per tick

        if (nextOrders[i].minutos >= 10) {
            // Order is fully eaten and paid at this point (tied to table paying timer)
            // Let's actually generate the receipt when the order hits 13 minutes (matches table timeline 2+10+3=15 roughly)
        }
        
        if (nextOrders[i].minutos >= 13) {
            const order = nextOrders[i];
            const tip = Math.floor(order.total * 0.15); // 15% tip
            receiptsToAdd.push({
                id: `REC-${Math.floor(Math.random()*100000)}`,
                tableId: order.tableId,
                guestName: 'Simulated Guest', // Reconciled later
                items: order.items,
                subtotal: order.total,
                tip: tip,
                total: order.total + tip,
                timePaid: new Date()
            });
            completedOrderTotals += (order.total + tip);
            // Remove order
            nextOrders.splice(i, 1);
        }
      }

      if (receiptsToAdd.length > 0) {
        setReceipts(prev => [...receiptsToAdd, ...prev]);
        setKpis(prev => ({
            ...prev,
            revenue: prev.revenue + completedOrderTotals * 0.85, // roughly adding base
            tips: prev.tips + completedOrderTotals * 0.15,
            wok1Time: Math.max(0, prev.wok1Time - 2), // Woks cool down
            wok2Time: Math.max(0, prev.wok2Time - 2),
        }));
      }

      return nextOrders;
    });

  }, [kpis]);

  useEffect(() => {
    if (isRunning) {
      tickRef.current = setInterval(() => {
        tick();
      }, 2000); // 2 seconds real-time = 1 simulation tick
    } else {
      if (tickRef.current) clearInterval(tickRef.current);
    }
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [isRunning, tick]);

  return (
    <SimulationContext.Provider value={{
      isRunning, startSimulation, stopSimulation, resetSimulation,
      tables, activeOrders, receipts, kpis, waitingQueue: waitingQueue.length
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) throw new Error('useSimulation must be used within SimulationProvider');
  return context;
};
