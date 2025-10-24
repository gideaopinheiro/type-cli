import inquirer from "inquirer";
import { Storage } from "../storage";
import { formatTimeString } from "../utils/time-string";

export async function endSessions(taskName?: string) {
  if (taskName !== undefined) {
    console.log(`[${taskName}] Finishing session`);
    console.log();
  }

  const tasks = await Storage.loadAllTasks();
  const openSessions = tasks.filter(
    (s) => s.sessions[s.sessions.length - 1]?.finishing === undefined
  );

  if (openSessions.length === 0) {
    console.log("🎉 Nenhuma sessão aberta!");
    return;
  }

  function renderChoices() {
    return openSessions.map((s) => {
      const record = s.sessions[s.sessions.length - 1];
      const elapsed = Date.now() - (record!.starting ?? 0);
      return {
        name: `${s.name.padEnd(20)} ${formatTimeString(elapsed)}`,
        value: s.name,
      };
    });
  }

  async function askWithTimer() {
    const prompt = inquirer.prompt([
      {
        type: "checkbox",
        name: "selected",
        message: "Selecione as sessões que deseja encerrar:",
        choices: renderChoices(),
        pageSize: 10,
        loop: true,
      },
    ]);

    const { selected } = await prompt;
    return selected as string[];
  }

  const selected = await askWithTimer();

  if (selected.length === 0) {
    console.log("Nenhuma sessão selecionada.");
    return;
  }

  for (const s of tasks) {
    if (selected.includes(s.name)) {
      await Storage.registerSessionFinish(s.name);
    }
  }

  console.log(`✅ Sessões finalizadas: ${selected.join(", ")}`);
}
