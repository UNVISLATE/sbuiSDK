import React, { useState } from "react";
import {
  QRCode,
  DateTimePicker,
  Row,
  Column,
  Card,
  Text,
  Badge,
  Dialog,
} from "../src";

export const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Steam state
  const [steamLogin, setSteamLogin] = useState("unvislate_player");
  const [steamAmount, setSteamAmount] = useState(1000);

  // VPS state
  const [vpsCpu, setVpsCpu] = useState(2);
  const [vpsRam, setVpsRam] = useState(4);
  const [vpsDisk, setVpsDisk] = useState(50);

  // Key state
  const [keyMasked, setKeyMasked] = useState(false);
  const licenseKey = "VK7JG-NPHTM-C97JM-9MPGT-3V66T";

  // Slot date state
  const [slotDate, setSlotDate] = useState("2026-11-09T12:00:00.000Z");

  const vlessKey =
    "vless://e83a91b4-42b7-4a0b-8d59-3a3f5a5c7c2e@de.saviorvpn.net:443?security=reality&snippets=true&fp=chrome&pbk=Z1FvB8_9q2mX4K...#SaviorVPN-DE";

  return (
    <div style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto", fontFamily: "sans-serif" }}>
      {/* Header */}
      <header style={{ marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
        <Row align="center" justify="between">
          <Column gap={6}>
            <Row gap={8} align="center">
              <Badge variant="primary" size="sm">sbuiSDK Dev Stand</Badge>
              <Text variant="caption" color="#a1a1aa">UNVISLATE • 5 вариантов карточек услуг</Text>
            </Row>
            <Text variant="h1" bold color="#ffffff">Интерактивная витрина карточек</Text>
            <Text variant="caption" color="#a1a1aa">
              Палитра: Stealth Dark (#09090b) + Фирменный бирюзовый акцент (#009080)
            </Text>
          </Column>
        </Row>
      </header>

      {/* Grid of 5 Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "24px" }}>
        
        {/* CARD 1: VLESS / Xray */}
        <Card variant="elevated" header="1. Подключение VLESS (Xray / Reality)">
          <Column gap={16}>
            <Row align="center" justify="between">
              <Text variant="caption" color="#a1a1aa">WireGuard & VLESS • Frankfurt 🇩🇪</Text>
              <Badge variant="success" size="sm">Активен</Badge>
            </Row>

            <Row gap={16} align="center" style={{ background: "#09090b", padding: "16px", borderRadius: "14px" }}>
              <QRCode value={vlessKey} size={130} plateRadius={18} logo="UNVIDark" />
              <Column gap={8} style={{ flex: 1 }}>
                <Text variant="caption" bold color="#a1a1aa">Ключ подключения:</Text>
                <input
                  type="text"
                  readOnly
                  value={vlessKey}
                  style={{
                    background: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "8px",
                    color: "#f4f4f5",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    width: "100%",
                  }}
                />
                <button
                  type="button"
                  className="sbui-btn variant-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(vlessKey);
                    alert("VLESS ключ скопирован!");
                  }}
                >
                  Копировать ключ
                </button>
              </Column>
            </Row>

            <Row justify="end">
              <button
                type="button"
                className="sbui-btn variant-ghost"
                onClick={() => setActiveModal("vless")}
              >
                Посмотреть в диалоге &rarr;
              </button>
            </Row>
          </Column>
        </Card>

        {/* CARD 2: Steam Top-up */}
        <Card variant="elevated" header="2. Пополнение Steam (price_type=custom)">
          <Column gap={14}>
            <Row align="center" justify="between">
              <Text variant="caption" color="#a1a1aa">Zero Trust кастомная сумма</Text>
              <Badge variant="primary" size="sm">price_type=custom</Badge>
            </Row>

            <Column gap={6}>
              <Text variant="caption" color="#a1a1aa">Логин аккаунта Steam:</Text>
              <input
                type="text"
                value={steamLogin}
                onChange={(e) => setSteamLogin(e.target.value)}
                style={{
                  background: "#09090b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "#ffffff",
                  fontFamily: "monospace",
                }}
              />
            </Column>

            <Column gap={6}>
              <Text variant="caption" color="#a1a1aa">Сумма пополнения (₽):</Text>
              <input
                type="number"
                min={100}
                max={15000}
                step={50}
                value={steamAmount}
                onChange={(e) => setSteamAmount(Number(e.target.value) || 0)}
                style={{
                  background: "#09090b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "10px",
                  color: "#00c7b0",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              />
            </Column>

            <Row justify="between" style={{ background: "#09090b", padding: "12px", borderRadius: "10px" }}>
              <Text variant="body" color="#a1a1aa">Итого к оплате (с комиссией 6%):</Text>
              <Text variant="body" bold color="#00c7b0">
                {(steamAmount * 1.06).toFixed(2)} ₽
              </Text>
            </Row>

            <Row justify="between" align="center">
              <button
                type="button"
                className="sbui-btn variant-ghost"
                onClick={() => setActiveModal("steam")}
              >
                Посмотреть в диалоге &rarr;
              </button>
              <button type="button" className="sbui-btn variant-primary">
                Оформить заказ
              </button>
            </Row>
          </Column>
        </Card>

        {/* CARD 3: VPS / VDS */}
        <Card variant="elevated" header="3. Конфигуратор VPS (price_type=configurable)">
          <Column gap={12}>
            <Row align="center" justify="between">
              <Text variant="caption" color="#a1a1aa">Финляндия 🇫🇮 • NVMe Cloud</Text>
              <Badge variant="warning" size="sm">configurable</Badge>
            </Row>

            <Column gap={4}>
              <Row justify="between">
                <Text variant="caption">Процессор:</Text>
                <Text variant="caption" bold color="#00c7b0">{vpsCpu} vCPU</Text>
              </Row>
              <input
                type="range"
                min={1}
                max={16}
                value={vpsCpu}
                onChange={(e) => setVpsCpu(Number(e.target.value))}
              />
            </Column>

            <Column gap={4}>
              <Row justify="between">
                <Text variant="caption">Оперативная память:</Text>
                <Text variant="caption" bold color="#00c7b0">{vpsRam} GB RAM</Text>
              </Row>
              <input
                type="range"
                min={2}
                max={64}
                step={2}
                value={vpsRam}
                onChange={(e) => setVpsRam(Number(e.target.value))}
              />
            </Column>

            <Column gap={4}>
              <Row justify="between">
                <Text variant="caption">Диск NVMe:</Text>
                <Text variant="caption" bold color="#00c7b0">{vpsDisk} GB NVMe</Text>
              </Row>
              <input
                type="range"
                min={20}
                max={400}
                step={10}
                value={vpsDisk}
                onChange={(e) => setVpsDisk(Number(e.target.value))}
              />
            </Column>

            <Row justify="between" align="center" style={{ background: "#09090b", padding: "12px", borderRadius: "10px" }}>
              <Text variant="body" color="#a1a1aa">Стоимость в месяц:</Text>
              <Text variant="h3" bold color="#00c7b0">
                {250 + (vpsCpu - 1) * 150 + (vpsRam - 2) * 60 + (vpsDisk - 20) * 3} ₽
              </Text>
            </Row>

            <Row justify="between" align="center">
              <button
                type="button"
                className="sbui-btn variant-ghost"
                onClick={() => setActiveModal("vps")}
              >
                Посмотреть в диалоге &rarr;
              </button>
              <button type="button" className="sbui-btn variant-primary">
                Заказать сервер
              </button>
            </Row>
          </Column>
        </Card>

        {/* CARD 4: Digital Key Delivery */}
        <Card variant="elevated" header="4. Доставка ключа (Key Pool Delivery)">
          <Column gap={14}>
            <Row align="center" justify="between">
              <Text variant="caption" color="#a1a1aa">Windows 11 Pro Retail</Text>
              <Badge variant="success" size="sm">Выдан</Badge>
            </Row>

            <Column gap={8} style={{ background: "#09090b", padding: "14px", borderRadius: "12px" }}>
              <Text variant="caption" color="#a1a1aa">Лицензионный код:</Text>
              <Row gap={8} align="center">
                <input
                  type="text"
                  readOnly
                  value={keyMasked ? "VK7JG-*****-*****-3V66T" : licenseKey}
                  style={{
                    flex: 1,
                    background: "#18181b",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    padding: "8px",
                    color: "#00c7b0",
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                />
                <button
                  type="button"
                  className="sbui-btn variant-secondary"
                  onClick={() => setKeyMasked(!keyMasked)}
                >
                  {keyMasked ? "🔒" : "👁️"}
                </button>
                <button
                  type="button"
                  className="sbui-btn variant-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(licenseKey);
                    alert("Ключ скопирован!");
                  }}
                >
                  Копировать
                </button>
              </Row>
            </Column>

            <Text variant="caption" color="#a1a1aa">
              🛡️ Гарантия возврата: 14 дней • Нативный рендер SaviorBill
            </Text>

            <Row justify="between" align="center">
              <button
                type="button"
                className="sbui-btn variant-ghost"
                onClick={() => setActiveModal("key")}
              >
                Посмотреть в диалоге &rarr;
              </button>
              <Text variant="caption" color="#71717a">#INV-99014</Text>
            </Row>
          </Column>
        </Card>

        {/* CARD 5: Slot Booking with DateTimePicker */}
        <Card variant="elevated" header="5. Аренда канала (DateTimePicker)" style={{ gridColumn: "1 / -1" }}>
          <Column gap={14}>
            <Row align="center" justify="between">
              <Text variant="caption" color="#a1a1aa">Бронирование выделенного порта 1 Gbit/s</Text>
              <Badge variant="primary" size="sm">DateTimePicker</Badge>
            </Row>

            <div style={{ maxWidth: "420px" }}>
              <DateTimePicker
                value={slotDate}
                onChange={setSlotDate}
                mode="datetime"
                label="Дата и время старта аренды:"
              />
            </div>

            <Row justify="between" align="center">
              <button
                type="button"
                className="sbui-btn variant-ghost"
                onClick={() => setActiveModal("slot")}
              >
                Посмотреть в диалоге &rarr;
              </button>
              <button type="button" className="sbui-btn variant-primary">
                Подтвердить бронирование
              </button>
            </Row>
          </Column>
        </Card>

      </div>

      {/* Dynamic Dialog Modal */}
      <Dialog
        open={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={
          activeModal === "vless" ? "Подключение VLESS" :
          activeModal === "steam" ? "Пополнение Steam" :
          activeModal === "vps" ? "Конфигурация VPS" :
          activeModal === "key" ? "Выданный цифровой ключ" : "Бронирование слота"
        }
        description="Просмотр карточки услуги в отдельном модальном окне"
        footer={
          <button
            type="button"
            className="sbui-btn variant-primary"
            onClick={() => setActiveModal(null)}
          >
            Закрыть диалог
          </button>
        }
      >
        {activeModal === "vless" && (
          <Column gap={16} align="center">
            <QRCode value={vlessKey} size={200} plateRadius={24} logo="UNVIDark" />
            <Text variant="caption" color="#a1a1aa">Отсканируйте код камерой в приложении Hiddify или v2rayNG</Text>
          </Column>
        )}
        {activeModal === "steam" && (
          <Column gap={10}>
            <Text variant="body">Логин: <b>{steamLogin}</b></Text>
            <Text variant="body">Сумма к списанию: <b>{(steamAmount * 1.06).toFixed(2)} ₽</b></Text>
          </Column>
        )}
        {activeModal === "vps" && (
          <Column gap={10}>
            <Text variant="body">Сервер: <b>{vpsCpu} vCPU / {vpsRam} GB RAM / {vpsDisk} GB NVMe</b></Text>
            <Text variant="body">Локация: <b>Helsinki, Finland 🇫🇮</b></Text>
          </Column>
        )}
        {activeModal === "key" && (
          <Column gap={10} align="center">
            <Text variant="h3" bold color="#00c7b0">{licenseKey}</Text>
            <Text variant="caption" color="#a1a1aa">Ключ сохранён в вашем личном кабинете</Text>
          </Column>
        )}
        {activeModal === "slot" && (
          <Column gap={10}>
            <Text variant="body">Время старта: <b>{slotDate}</b></Text>
            <Text variant="body">Канал: <b>1 Gbit/s Dedicated</b></Text>
          </Column>
        )}
      </Dialog>
    </div>
  );
};
