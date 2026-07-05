import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Award, BadgeInfo, BookOpen, Clapperboard, Flame, Grid3X3, Home, Mail, Menu, Search, ShieldCheck, Sparkles, Star, TrendingUp, Tv, X } from "lucide-react";
import { channels, items } from "./data/catalog";
import "./styles.css";

const nav = [
  ["首页", "home", Home],
  ["全部影片", "library", Clapperboard],
  ["分类频道", "channels", Grid3X3],
  ["热播榜", "rank", TrendingUp],
  ["搜索", "search", Search],
  ["服务支持", "service", ShieldCheck]
];

function App() {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("全部");
  const [current, setCurrent] = useState(null);
  const [menu, setMenu] = useState(false);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const text = `${item.title} ${item.channel} ${item.area} ${item.year} ${item.state}`.toLowerCase();
      return (!query || text.includes(query.toLowerCase())) && (channel === "全部" || item.channel === channel);
    });
  }, [query, channel]);

  const go = (next) => {
    setPage(next);
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header page={page} go={go} menu={menu} setMenu={setMenu} />
      <main>
        {page === "home" && <HomePage go={go} setCurrent={setCurrent} />}
        {page === "library" && <Library filtered={filtered} query={query} setQuery={setQuery} channel={channel} setChannel={setChannel} setCurrent={setCurrent} />}
        {page === "channels" && <Channels go={go} setChannel={setChannel} />}
        {page === "rank" && <Rank setCurrent={setCurrent} />}
        {page === "search" && <SearchPage query={query} setQuery={setQuery} filtered={filtered} setCurrent={setCurrent} />}
        {page === "service" && <Service />}
      </main>
      <Footer go={go} />
      {current && <Detail item={current} close={() => setCurrent(null)} />}
    </>
  );
}

function Header({ page, go, menu, setMenu }) {
  return (
    <header className="topbar">
      <button className="logo" onClick={() => go("home")}><span>映</span><b>日韩影视网</b></button>
      <button className="menu" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
      <nav className={menu ? "nav open" : "nav"}>
        {nav.map(([label, key, Icon]) => <button key={key} className={page === key ? "on" : ""} onClick={() => go(key)}><Icon size={16} />{label}</button>)}
      </nav>
    </header>
  );
}

function HomePage({ go, setCurrent }) {
  const hero = items[0];
  return (
    <>
      <section className="lead">
        <div className="lead-copy">
          <span className="chip-hot"><Sparkles size={14} /> 今日主推</span>
          <h1>热播日韩剧电影与高清片库</h1>
          <p>{hero.summary} 站内整理韩剧、日剧、日韩电影、动漫综艺和高分片单，分类清晰，浏览顺手。</p>
          <div className="lead-actions"><button onClick={() => setCurrent(hero)}>查看详情</button><button onClick={() => go("library")}>进入片库</button></div>
        </div>
        <div className="lead-poster"><img src={hero.poster} alt={hero.title} /><b>{hero.score}</b></div>
        <div className="lead-rank">
          <h2>热播速览</h2>
          {items.slice(1, 6).map((item, index) => <button key={item.id} onClick={() => setCurrent(item)}><span>{index + 1}</span><b>{item.title}</b><em>{item.channel}</em></button>)}
        </div>
      </section>

      <Block title="今日精选" kicker="Daily Picks" action="全部影片" onAction={() => go("library")}>
        <PosterGrid list={items.slice(6, 18)} setCurrent={setCurrent} />
      </Block>

      <Block title="日韩热播" kicker="Hot Stream" action="热播榜" onAction={() => go("rank")}>
        <Spotlight list={items.slice(18, 26)} setCurrent={setCurrent} />
      </Block>

      <Block title="最新上架" kicker="New Release" action="搜索片库" onAction={() => go("search")}>
        <NewsList list={items.slice(26, 40)} setCurrent={setCurrent} />
      </Block>

      <section className="channel-wall">
        <Head title="分类频道" kicker="Channels" action="全部频道" onAction={() => go("channels")} />
        <ChannelCards go={go} />
      </section>

      <section className="two-col">
        <div><Head title="高分推荐" kicker="Top Rated" /><MiniCards list={[...items].sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 8)} setCurrent={setCurrent} /></div>
        <div><Head title="热播榜入口" kicker="Ranking" action="完整榜单" onAction={() => go("rank")} /><RankMini list={items.slice(0, 8)} setCurrent={setCurrent} /></div>
      </section>
    </>
  );
}

function Library({ filtered, query, setQuery, channel, setChannel, setCurrent }) {
  return (
    <>
      <HeroTitle title="全部影片" kicker="Library" text="浏览日韩精选、韩剧热播、日剧推荐、韩国电影、日本电影、动作冒险、悬疑犯罪、爱情治愈、喜剧综艺和动漫动画。" />
      <Filter query={query} setQuery={setQuery} channel={channel} setChannel={setChannel} />
      <PosterGrid list={filtered} setCurrent={setCurrent} dense />
    </>
  );
}

function Channels({ go, setChannel }) {
  return (
    <>
      <HeroTitle title="分类频道" kicker="Channels" text="按题材和观看偏好进入对应内容区，快速找到适合今天观看的片单。" />
      <ChannelCards go={(next) => go(next)} setChannel={setChannel} large />
    </>
  );
}

function Rank({ setCurrent }) {
  return (
    <>
      <HeroTitle title="热播榜" kicker="Ranking" text="按热度、评分和更新状态整理站内热门日韩影视内容。" />
      <div className="rank-list">{items.slice().sort((a, b) => b.heat - a.heat).slice(0, 60).map((item, index) => <button key={item.id} onClick={() => setCurrent(item)}><b>{index + 1}</b><img src={item.poster} alt={item.title} /><span><strong>{item.title}</strong><em>{item.channel} · {item.area} · {item.year}</em></span><i>{item.score}</i></button>)}</div>
    </>
  );
}

function SearchPage({ query, setQuery, filtered, setCurrent }) {
  return (
    <>
      <HeroTitle title="搜索片库" kicker="Search" text="输入片名、分类、地区、年份或更新状态，快速筛选站内影视内容。" />
      <div className="big-search"><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：韩剧、悬疑、2026、日本电影" autoFocus /></div>
      <PosterGrid list={filtered} setCurrent={setCurrent} dense />
    </>
  );
}

function Service() {
  return (
    <section className="service">
      <span>Support</span>
      <h1>服务支持</h1>
      <p>日韩影视网专注影视资料整理、分类索引与内容推荐，帮助用户发现更多值得关注的日韩影视作品。</p>
      <div className="service-cards">
        <article><BadgeInfo /><h2>网站说明</h2><p>站内内容用于影视资料整理、片单推荐和分类索引展示。</p></article>
        <article><ShieldCheck /><h2>版权声明</h2><p>片名、海报和文字介绍版权归原作者、出品方及发行方所有。</p></article>
        <article><Mail /><h2>联系合作</h2><p>内容纠错、友情链接和合作事宜，可通过站点预留邮箱联系。</p></article>
      </div>
      <h2>免责声明</h2>
      <p>本站不存储任何视频文件，不提供影视文件上传服务。如权利方认为页面信息需要调整，请提交说明，我们会及时处理。</p>
    </section>
  );
}

function Block({ title, kicker, action, onAction, children }) {
  return <section className="block"><Head title={title} kicker={kicker} action={action} onAction={onAction} />{children}</section>;
}

function Head({ title, kicker, action, onAction }) {
  return <div className="head"><div><span>{kicker}</span><h2>{title}</h2></div>{action && <button onClick={onAction}>{action}</button>}</div>;
}

function HeroTitle({ title, kicker, text }) {
  return <section className="page-title"><span>{kicker}</span><h1>{title}</h1><p>{text}</p></section>;
}

function PosterGrid({ list, setCurrent, dense }) {
  return <div className={dense ? "poster-grid dense" : "poster-grid"}>{list.map((item) => <Poster key={item.id} item={item} setCurrent={setCurrent} />)}</div>;
}

function Poster({ item, setCurrent }) {
  return <button className="poster-card" onClick={() => setCurrent(item)}><div><img src={item.poster} alt={item.title} loading="lazy" /><span>{item.channel}</span><b>{item.score}</b></div><strong>{item.title}</strong><em>{item.area} · {item.year} · {item.state}</em></button>;
}

function Spotlight({ list, setCurrent }) {
  return <div className="spotlight">{list.map((item) => <button key={item.id} onClick={() => setCurrent(item)} style={{ backgroundImage: `linear-gradient(0deg, rgba(8,18,28,.8), rgba(8,18,28,.1)), url(${item.scene})` }}><span>{item.channel}</span><strong>{item.title}</strong><em>{item.score} 分 · {item.state}</em></button>)}</div>;
}

function NewsList({ list, setCurrent }) {
  return <div className="news-list">{list.map((item, index) => <button key={item.id} onClick={() => setCurrent(item)}><b>{String(index + 1).padStart(2, "0")}</b><span><strong>{item.title}</strong><em>{item.channel} · {item.area} · {item.year}</em></span><i>{item.state}</i></button>)}</div>;
}

function ChannelCards({ go, setChannel, large }) {
  return <div className={large ? "channel-grid large" : "channel-grid"}>{channels.map((item, index) => <button key={item.name} className={`channel-card ${item.accent}`} onClick={() => { setChannel?.(item.name); go("library"); }}><b>{String(index + 1).padStart(2, "0")}</b><strong>{item.name}</strong><span>{item.note}</span><em>{items.filter((movie) => movie.channel === item.name).length} 部</em></button>)}</div>;
}

function MiniCards({ list, setCurrent }) {
  return <div className="mini-cards">{list.map((item) => <button key={item.id} onClick={() => setCurrent(item)}><img src={item.poster} alt={item.title} /><span><strong>{item.title}</strong><em>{item.channel} · {item.score} 分</em></span></button>)}</div>;
}

function RankMini({ list, setCurrent }) {
  return <div className="rank-mini">{list.map((item, index) => <button key={item.id} onClick={() => setCurrent(item)}><b>{index + 1}</b><span>{item.title}</span><em>{item.heat}</em></button>)}</div>;
}

function Filter({ query, setQuery, channel, setChannel }) {
  return <section className="filters"><div className="input-wrap"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索影片名、分类、地区或年份" /></div><div className="filter-chips">{["全部", ...channels.map((item) => item.name)].map((name) => <button key={name} className={channel === name ? "active" : ""} onClick={() => setChannel(name)}>{name}</button>)}</div></section>;
}

function Detail({ item, close }) {
  return <div className="drawer-mask" onClick={close}><aside className="drawer" onClick={(event) => event.stopPropagation()}><button className="close" onClick={close}><X /></button><img src={item.poster} alt={item.title} /><div><span className="chip-hot"><Tv size={14} /> {item.channel}</span><h2>{item.title}</h2><div className="meta"><span><Star size={14} /> {item.score}</span><span>{item.area}</span><span>{item.year}</span><span>{item.state}</span></div><p>{item.summary}</p><dl><dt>导演</dt><dd>{item.director}</dd><dt>主演</dt><dd>{item.cast}</dd></dl><button className="solid" onClick={close}>继续浏览</button></div></aside></div>;
}

function Footer({ go }) {
  return <footer className="footer"><div><strong>日韩影视网</strong><p>专注日韩电影、电视剧、综艺与动漫内容整理，发现更多值得观看的亚洲影像故事。</p></div><nav><button onClick={() => go("library")}>全部影片</button><button onClick={() => go("channels")}>分类频道</button><button onClick={() => go("rank")}>热播榜</button><button onClick={() => go("service")}>免责声明</button></nav><div><b>友情链接</b><a href="#">日韩剧场</a><a href="#">亚洲影评</a><a href="#">电影片单</a></div><p className="copy">© 2026 日韩影视网. 本站仅提供影视信息整理与推荐，相关版权归原作者及发行方所有。联系邮箱：contact@example.com</p></footer>;
}

createRoot(document.getElementById("root")).render(<App />);

