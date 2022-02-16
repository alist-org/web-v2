let back_end_address = import.meta.env.VITE_SERVER_URL as string;
if (back_end_address === "/") {
  back_end_address = window.location.origin + "/";
}
export const host = back_end_address;
