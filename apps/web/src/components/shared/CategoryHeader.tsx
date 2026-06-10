export function CategoryHeader({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex items-center flex-wrap gap-x-8 gap-y-4 mb-6">
      <h2 className="font-playfair font-bold text-xl text-black">{title}</h2>
      <div className="flex flex-wrap gap-6 text-[13px] font-medium text-gray-700">
        {links.map((link) => (
          <a href="#" key={link} className="hover:text-red-600 transition-colors">
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}
