"use client";

import "./layout.css";

import { useEffect, useRef, useState } from "react";

import { Container, Typography } from "@material-ui/core";
import { NextUIProvider } from "@nextui-org/react";

import type { Row } from "./row";

import { RowSchemaZod } from "./row";
import TransactionTable from "./TransactionTable";

const packageManagers = {
  bun: "bunx",
  pnpm: "pnpx",
  npm: "npx",
  yarn: "yarn dlx",
};

const toCacheKey = (index: number) =>
  `mttq0011001932418VCB/${index.toString().padStart(2, "0")}.csv`;

const parseCSV = (csv: string) => {
  const lines = csv.split("\n");
  const headers = lines[0].split(",");

  const data = lines.slice(1).map((line) => {
    const obj = {};
    const splittedLine = line.split(",");
    const lineCells = splittedLine
      .slice(0, 5)
      .concat(splittedLine.slice(5).join(","));

    lineCells.forEach((value, i) => {
      obj[headers[i]] = value;
    });
    return obj;
  });
  return data;
};

export default function Home() {
  const [allRows, setAllRows] = useState<Array<Row>>([]);

  // load static csv files on page load and cache to local storage
  useEffect(() => {
    // load all 10 csv files in /mttq0011001932418VCB from 01092024.csv to 10092024.csv
    // if some of them are already cached, skip them
    if (typeof window === "undefined") return;

    console.log("Start loading data set");

    const todos = Array.from({ length: 25 }, (_, i) => i).map((i) => {
      const key = toCacheKey(i);
      if (localStorage.getItem(key)) {
        return Promise.resolve(parseCSV(localStorage.getItem(key)));
      } else {
        return fetch(`/${key}`)
          .then((res) => res.text())
          .then((data) => {
            if (i < 5) {
              localStorage.setItem(key, data);
              console.log(`Fetched and cached ${key}`, data);
            }

            return parseCSV(data);
          });
        // .catch((err) => console.error(`Failed to fetch ${key}: `, err));
      }
    });

    if (todos.length === 0) return;
    Promise.all(todos).then((res) => {
      const rows = res
        .reduce((acc, val) => acc.concat(val), [])
        .map((row, i) => ({
          id: i,
          ...row,
        }));

      console.log(rows.slice(0, 20));
      setAllRows(
        rows
          .map((row) => RowSchemaZod.safeParse(row))
          .filter((r) => r.success)
          .map((r) => r.data),
      );
      console.log("All csv files loaded");
    });
  }, []);

  return (
    <NextUIProvider>
      <main className="min-h-screen w-full bg-white bg-fixed selection:bg-zinc-300 selection:text-black">
        <Container>
          <div className="py-[50px]">
            <Typography variant="h4" className="text-center">
              Tra cứu thông tin sao kê từ thiện
            </Typography>
          </div>
          <TransactionTable allRows={allRows} />
        </Container>
        {/* </div> */}
        <footer className="container mt-10 grid place-items-center pb-4 text-sm text-neutral-400">
          <span className="flex items-center gap-1">
            &copy;
            <span>{new Date().getFullYear()}</span>
            <a href="https://github.com/galin-chung-nguyen" target="_blank">
              galin-chung-nguyen
            </a>
          </span>
        </footer>
      </main>
    </NextUIProvider>
  );
}
