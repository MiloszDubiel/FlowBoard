"use client";

export default function Board({ columns }: any) {
  return (
    <>
      {columns.map((column: any) => (
        <div
          key={column.id}
          className="flex w-80 flex-col rounded-lg bg-muted p-3"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{column.name}</h3>

            <button className="rounded px-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              ⋯
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {column.cards.map((card: any) => (
              <div
                key={card}
                className="cursor-pointer rounded-md border bg-card p-3 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-sm font-medium">{card}</p>
              </div>
            ))}
          </div>

          <button className="mt-3 rounded-md p-2 text-left text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            + Dodaj kartę
          </button>
        </div>
      ))}
      <button className="h-fit w-80 rounded-lg border bg-muted p-3 text-left text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
        + Dodaj kolejną listę
      </button>
    </>
  );
}
