import inquirer from "inquirer";
import { Storage } from '../storage'
import { formatTimeString } from "../utils/time-string";

export async function endSessions(sessionName?: string) {
  if (sessionName !== undefined) {
    console.log('finishing session ', sessionName);
    console.log()
  }

  const sessions = await Storage.loadAllSessions();
  const openSessions = sessions.filter(
    (s) => s.records[s.records.length - 1]?.finishing === undefined
  );

  if (openSessions.length === 0) {
    console.log("🎉 Nenhuma sessão aberta!");
    return;
  }

  function renderChoices() {
    return openSessions.map((s) => {
      const record = s.records[s.records.length - 1];
      const elapsed = Date.now() - (record!.starting ?? 0);
      return {
        name: `${s.name.padEnd(20)} ${formatTimeString(elapsed)}`,
        value: s.name,
      };
    });

  }

  async function askWithTimer() {
    console.log()
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

  for (const s of sessions) {
    if (selected.includes(s.name)) {
      await Storage.registerSessionFinish(s.name)
    }
  }

  console.log(`✅ Sessões finalizadas: ${selected.join(", ")}`);
}
