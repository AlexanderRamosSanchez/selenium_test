// 🔹 Interfaz base que representa directamente el modelo del backend
export interface Workshop {
  id: number;
  name: string;
  description: string;
  dateStart: Date;
  dateEnd: Date;
  observation: string;
  active: boolean;
  personId: string;
  personName?: string;
}

// 🔹 Datos que se envían al crear o actualizar (sin ID)
export interface WorkshopRequestDto {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  observation: string;
  state?: string;
  personId: string;
  personName?: string;
}

// 🔹 Datos que se reciben al obtener un taller (igual al modelo base)
export interface WorkshopResponseDto {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  observation: string;
  state: string;
  personId: string;
  personName?: string;
}
