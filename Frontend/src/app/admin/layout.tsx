"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

/* ─────────────────────────────────────────
   Nav structure
───────────────────────────────────────── */
const NAV_GROUPS = [
  {
    group: "Utama",
    items: [
      { icon: "▣",  label: "Dashboard",        href: "/admin/dashboard" },
    ],
  },
  {
    group: "Katalog",
    items: [
      { icon: "◫",  label: "Produk",            href: "/admin/produk" },
      { icon: "⬡",  label: "Inventory",         href: "/admin/inventory" },
      { icon: "⊞",  label: "Image Manager",     href: "/admin/images" },
    ],
  },
  {
    group: "Operasional",
    items: [
      { icon: "◈",  label: "Order",             href: "/admin/order" },
      { icon: "◻",  label: "To-do & Task",      href: "/admin/todo" },
      { icon: "◎",  label: "User & Role",       href: "/admin/users" },
    ],
  },
  {
    group: "Analitik",
    items: [
      { icon: "⟁",  label: "Laporan & Export",  href: "/admin/laporan" },
    ],
  },
  {
    group: "Sistem",
    items: [
      { icon: "⊙",  label: "Pengaturan",        href: "/admin/settings" },
    ],
  },
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

/* ─────────────────────────────────────────
   Layout
───────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [expanded, setExpanded]     = useState(true);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem("dopamine_admin");
    if (!isAdmin) router.replace("/");
    else setAuthorized(true);
  }, [router]);

  function handleLogout() {
    sessionStorage.removeItem("dopamine_admin");
    router.push("/");
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#f5f3ef] flex items-center justify-center">
        <div className="text-xs text-gray-400 tracking-widest animate-pulse">MEMUAT...</div>
      </div>
    );
  }

  const sidebarW   = expanded ? "240px" : "60px";
  const mainMargin = expanded ? "240px" : "60px";

  return (
    <div className="flex min-h-screen bg-[#f5f3ef]">

      {/* SIDEBAR */}
      <aside
        className="fixed left-0 top-0 h-full z-40 bg-[#0a0a0a] flex flex-col overflow-hidden"
        style={{ width: sidebarW, transition: "width 260ms cubic-bezier(0.4, 0, 0.2, 1)" }}
      >
        {/* Top bar */}
        <div className="flex items-center border-b border-white/10 flex-shrink-0 px-3" style={{ height: "60px" }}>
          {expanded ? (
            <>
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-black text-xs font-black italic select-none">D</span>
              </div>
              <div className="ml-3 flex-1 overflow-hidden">
                <div className="text-white text-xs font-black tracking-[3px] uppercase">Dopamine</div>
                <div className="text-white/30 text-[9px] tracking-widest">Admin Panel</div>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-all ml-1.5"
                aria-label="Minimize sidebar"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M8.5 1.5L3.5 6.5l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          ) : (
            /* COLLAPSED: Logo D saja — hover jadi expand arrow */
            <button
              onClick={() => setExpanded(true)}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto flex-shrink-0 hover:bg-white/80 transition-colors group relative"
            >
              <span className="text-black text-xs font-black italic select-none transition-opacity duration-150 group-hover:opacity-0 absolute">
                D
              </span>
              <svg
                width="13" height="13" viewBox="0 0 13 13" fill="none"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute"
              >
                <path d="M4.5 1.5l5 5-5 5" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-5" style={{ scrollbarWidth: "none" }}>
          {expanded ? (
            <div className="px-3 space-y-5">
              {NAV_GROUPS.map((group) => (
                <div key={group.group}>
                  <div className="text-[9px] font-black tracking-[3px] uppercase text-white/25 px-2 mb-1.5">
                    {group.group}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                            active ? "bg-white text-black" : "text-white/55 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          <span className={`text-sm leading-none w-5 text-center flex-shrink-0 ${active ? "text-black" : "text-white/45 group-hover:text-white"}`}>
                            {item.icon}
                          </span>
                          <span className="text-[13px] font-semibold tracking-wide whitespace-nowrap">
                            {item.label}
                          </span>
                          {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-black/40 flex-shrink-0" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 px-2">
              {ALL_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={item.label}
                    className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all group ${
                      active ? "bg-white text-black" : "text-white/45 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="text-sm leading-none">{item.icon}</span>
                    <span className="
                      pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50
                      bg-white text-black text-[11px] font-bold px-2.5 py-1.5 rounded-lg shadow-xl
                      whitespace-nowrap
                      opacity-0 group-hover:opacity-100
                      translate-x-1 group-hover:translate-x-0
                      transition-all duration-150
                    ">
                      {item.label}
                      <span className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-white" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Bottom: user + logout */}
        <div className="border-t border-white/10 flex-shrink-0" style={{ padding: expanded ? "14px 16px" : "14px 10px" }}>
          {expanded ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-xs font-bold truncate">Admin</div>
                <div className="text-white/30 text-[10px] truncate">Super Admin</div>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9.5 9.5L13 7m0 0L9.5 4.5M13 7H5"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3M9.5 9.5L13 7m0 0L9.5 4.5M13 7H5"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 min-h-screen"
        style={{
          marginLeft: mainMargin,
          transition: "margin-left 260ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Wrapper: max-width + padding konsisten — konten tidak terasa kosong */}
        <div className="min-h-screen px-8 sm:px-10 md:px-12 py-8 max-w-[1200px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}