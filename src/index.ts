import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';

const token = process.env.BOT_TOKEN;
if (!token) { console.error('Set BOT_TOKEN'); process.exit(1); }
const bot = new Telegraf(token);

bot.command('price', async (ctx) => {
  const symbol = (ctx.message.text.split(' ')[1] ?? 'BTC').toUpperCase();
  const map: Record<string,string> = { BTC:'bitcoin', ETH:'ethereum', SOL:'solana' };
  const id = map[symbol] ?? symbol.toLowerCase();
  try {
    const r = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
    const j = await r.json();
    const p = j[id]?.usd;
    if (!p) return ctx.reply(`Не нашёл цену для ${symbol}`);
    ctx.reply(`${symbol}: $${p}`);
  } catch (e: any) {
    ctx.reply(`Ошибка: ${e.message}`);
  }
});

bot.start((ctx)=>ctx.reply('Привет! /price BTC | /price ETH | /price SOL'));
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
