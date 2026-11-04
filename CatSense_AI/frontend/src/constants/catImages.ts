import type { ImageSourcePropType } from "react-native";

// Cat photos of the prototype (Stitch server). For the real app the photo of each cat comes from the
// backend (photo_url) or from the image picker; these are only the demo cats.
// Offline later: download each image into  frontend/assets/images/  and use require('...') instead of { uri }.
export const catPhotos: Record<
  | "milo"
  | "miloCard"
  | "miloShelf"
  | "luna"
  | "oliver"
  | "allClear"
  | "sleepingKitten",
  ImageSourcePropType
> = {
  // assets/images/milo.jpg
  milo: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7KDpwmVBFDZvwrDD7yHodiz7cc1PfSpUPNyYF-GNaNocTFWOaG3ibEAvMCemIbfg1UJtXBRP8U4eRbz_sUf8VabLzb9Ce0x4gnhtUgdGcBRj7Jcu65vxBqfOIpuPubnruZdxoONmsvrxsQ03BnwO_ZH15bqhtK0Nn0TzD0xWCjyDSTByPVKIBuCC9G63QkFEsyTgCE7QlCZgXboIQ8avkF2qxj3_jYQy_LaDQ_Tom",
  },
  // assets/images/miloCard.jpg
  miloCard: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOkPcxcrfDLOy-6HrGBgoralsl9MGpeunxiiPSkkBlXWXvho6fkF7lyH9KRobmUfbi_cwedT69mGc7cx0o7RILX_cppIb1vS2UsxZKlDzDTJNFFofClp3AopZWCzda6wTMX-KrPVJLgIazV2CaOrDNMiB49bEjOQgJZ9QDAG81PlqgFTDh7FgX5zLVrY_1VHlqLrqohMgnFJvSzhXbGRgvwgN0oeFB6pn4CPuo4GE5",
  },
  // assets/images/miloShelf.jpg
  miloShelf: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDyOP5PofuAp1GWRHvekeJdTdLjjd8R6CIKjL4w-ZwphERDDNs6HXIXVRJHlQE2lqQe8iOgiTzlwscAJQzY9eZYwyC7KR1i2cD_WEQotnJGAa97aOtxaBHN1OOtHwuO3gyFSXhTZYLDRZ6vGtrZyfXGUMcol1HJco2Aa7rpOzh1rh5ZydHUuRT773I6eTcEBsNTX8RhkhyRddDQTRopGvrEi-fgJixllhx2jC6I1VaO",
  },
  // assets/images/luna.jpg
  luna: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjx8ckfJqq87yEu34RtMLRYBDgN2YM5kAfwVegRKYkd3vgRy4yDEjl_iWKaa0fSF0LjCIoSimKWFf_CK_BETTQhPyUi0OaGJydQD2C1_sJ8hKWpgX93zajxFkYTe95BsXdnaqFpOnsQvCnOK6mdCcVy5I0rA3MjI8NopEPqgETnu0x7psHdg9cp_8dWmB7aiMYMqsJMItgq-B0davbg5kJ7Pmvy2Jez8tBhLIpDvda",
  },
  // assets/images/oliver.jpg
  oliver: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3xszlzjCYvE2OIJgXKmnoXS6JASyTMWbsuqHIW00aHwQzdL-f0yfbPrKv9z6F7MIKzWIeQSFTpkvgOoyvyxuyDW9pzyjMz2X-WLTe6F5QXkPMbekDbIhFl2oXySm-RdOpf4Wv9EBYgJGUP7EjltqcjKNnIRinHwq-DBQA8Q7N-5MS1ke5utaqVL3wKYgQJDJlg_4anfWkr8XBH0nRNs8PHgvtwRgUSChmsJNx-yoj",
  },
  // assets/images/allClear.jpg
  allClear: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBab8OLZt107q9iSRiRwUAyfD53o3_2dknLsMsrM_V2KxX-HFwZsyAP_Vun-hKzbnIBAzU8qsy7Wi8I8Bi-iriqvvDqy397TJRVCuyV6MYl2ls7_Kv0hytzz131COaTaQVaFjDd23X1mYN9Cn8oZ_JcGYKbgR8dG0L3x_6iTcw9KzW1h-pMNbcQIgrpJvlcGHleJe-9qWZWM4k3iv7rQ-Sl_zHTwgBLbYxyhuRmpDB3",
  },
  // assets/images/sleepingKitten.jpg (History: empty state)
  sleepingKitten: {
    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1iOjvPJ0C76-qgvep_3B-aJdHCIzR6g5X0oTxz7O5S8w_rG5tKc68ov845kdeBuDoJPYGLQiwFiJxZyRwVFDHUIkiJW-WRIuWqIYAZ-Ud6xAuJ18lul-JqeUx5HMW9SIMLP3mbk_yL-EozHV5zl_VtyZcVzNrNLLYomfXdRHGiGb5E3KSWvbPiylnf_Wp2TT7pUd4YpmQdUqRRFFK_kuS_A0BTJ6vMJsgkabeXr1t",
  },
};
