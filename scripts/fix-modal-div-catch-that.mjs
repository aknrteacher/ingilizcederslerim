import fs from "fs";
import path from "path";

function walk(d, acc = []) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name.endsWith("catch-that.tsx")) acc.push(p);
  }
  return acc;
}

const root = path.resolve(import.meta.dirname, "../client/src/pages/primary");
const old = `                  </div><div className="flex flex-col gap-3">`;
const neu = `                  </div>
                </div>

                <div className="flex flex-col gap-3">`;

for (const f of walk(root)) {
  let c = fs.readFileSync(f, "utf8");
  if (!c.includes(old)) continue;
  fs.writeFileSync(f, c.replace(old, neu));
  console.log("fixed", path.relative(process.cwd(), f));
}
