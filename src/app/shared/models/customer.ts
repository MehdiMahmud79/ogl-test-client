export type Customer = {
  id: number | null;
  name: string;
  street: string;
  city: string;
  country: string;
  postcode: string;

}

export type CityCount = {
  city: string;
  count: number;
}
