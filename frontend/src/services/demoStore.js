// Demo-mode persistence (GitHub Pages has no backend): submissions live in localStorage
// so the booking, contact and profile flows still behave end to end.
const KEY = "nuvela.demo";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? { appointments: [], leads: [] };
  } catch {
    return { appointments: [], leads: [] };
  }
}

function write(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Non-critical in demo mode.
  }
}

export const makeReference = (prefix = "NV") =>
  `${prefix}-${new Date().getFullYear().toString().slice(2)}${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export const demoStore = {
  addAppointment(appointment) {
    const data = read();
    const record = { ...appointment, id: makeReference(), status: "pending", createdAt: new Date().toISOString() };
    data.appointments.unshift(record);
    write(data);
    return record;
  },
  listAppointments(phone) {
    return read().appointments.filter((a) => !phone || a.phone?.replace(/\D/g, "") === phone.replace(/\D/g, ""));
  },
  addLead(lead) {
    const data = read();
    const record = { ...lead, id: makeReference("MSG"), createdAt: new Date().toISOString() };
    data.leads.unshift(record);
    write(data);
    return record;
  },
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
