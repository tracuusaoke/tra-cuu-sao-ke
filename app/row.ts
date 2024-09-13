import { z } from "zod";

export const RowSchemaZod = z.object({
  id: z.number(),
  TNXDate: z.string(),
  DocNo: z.string(),
  Debit: z.string(),
  Credit: z.string(),
  Balance: z.string(),
  "Transactions in Detail": z.string(),
});
export type Row = z.infer<typeof RowSchemaZod>;
