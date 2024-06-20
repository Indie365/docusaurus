"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38439],{51374:(e,s,t)=>{t.d(s,{Z:()=>n});const n=t.p+"assets/images/slash-introducing-411a16dd05086935b8e9ddae38ae9b45.svg"},17295:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>o,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var n=t(24246),l=t(71670);const r={},i="Test links",d={id:"tests/links/test-markdown-links",title:"Test links",description:"These are dogfood tests showing that Markdown links with md/mdx file references are resolved correctly.",source:"@site/_dogfooding/_docs tests/tests/links/test-markdown-links.mdx",sourceDirName:"tests/links",slug:"/tests/links/test-markdown-links",permalink:"/tests/docs/tests/links/test-markdown-links",draft:!1,unlisted:!1,tags:[],version:"current",lastUpdatedBy:"franzd1",lastUpdatedAt:1718898037e3,frontMatter:{},sidebar:"sidebar",previous:{title:"Target doc",permalink:"/tests/docs/tests/links/target-doc-slug"},next:{title:"TOC partial test",permalink:"/tests/docs/tests/toc-partials/"}},o={},c=[{value:"Resolvable links",id:"resolvable-links",level:2},{value:"Complex resolvable links",id:"complex-resolvable-links",level:2},{value:"Unresolvable links",id:"unresolvable-links",level:2},{value:"Links in comments",id:"links-in-comments",level:2},{value:"Reference-style links",id:"reference-style-links",level:2}];function a(e){const s={a:"a",code:"code",em:"em",h1:"h1",h2:"h2",hr:"hr",img:"img",p:"p",pre:"pre",strong:"strong",...(0,l.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"test-links",children:"Test links"}),"\n",(0,n.jsx)(s.p,{children:"These are dogfood tests showing that Markdown links with md/mdx file references are resolved correctly."}),"\n",(0,n.jsxs)(s.p,{children:["Also proves that ",(0,n.jsx)(s.a,{href:"https://github.com/facebook/docusaurus/issues/9048",children:"#9048"})," linking bugs are solved."]}),"\n",(0,n.jsx)(s.hr,{}),"\n",(0,n.jsx)(s.h2,{id:"resolvable-links",children:"Resolvable links"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"target.mdx"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"./target.mdx"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"../links/target.mdx"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug?age=42#target-heading",children:"./target.mdx?age=42#target-heading"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug?qs=value%20with%20space",children:"<./target.mdx?qs=value with space>"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",title:"link title",children:"target.mdx 'link title'"})}),"\n",(0,n.jsx)(s.h2,{id:"complex-resolvable-links",children:"Complex resolvable links"}),"\n",(0,n.jsxs)(s.p,{children:["Some of those are edge cases reported in ",(0,n.jsx)(s.a,{href:"https://github.com/facebook/docusaurus/issues/9048",children:"#9048"})]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.code,{children:"inline triple backticks code block, see https://github.com/facebook/docusaurus/issues/9048#issuecomment-1959199829"})}),"\n",(0,n.jsx)("p",{children:(0,n.jsxs)("b",{children:[(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"./target.mdx"})," bolded"]})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsxs)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:[(0,n.jsx)(s.strong,{children:"./target.mdx"})," with ",(0,n.jsx)(s.em,{children:"italic"})," and ",(0,n.jsx)("span",{style:{color:"red"},children:(0,n.jsx)(s.code,{children:"JSX"})})]})}),"\n",(0,n.jsxs)(s.p,{children:[(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug#target-heading",children:(0,n.jsx)(s.code,{children:"Type1"})}),"<",(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug#target-heading",children:(0,n.jsx)(s.code,{children:"Type2"})}),">"]}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"./target.mdx link\ndeclared\non\nmultiple\nlines\n"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:(0,n.jsx)(s.img,{alt:"Image with ./target.mdx link",src:t(51374).Z+"",width:"760",height:"160"})})}),"\n",(0,n.jsx)(s.h2,{id:"unresolvable-links",children:"Unresolvable links"}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/facebook/docusaurus/blob/main/README.md",children:"https://github.com/facebook/docusaurus/blob/main/README.md"})}),"\n",(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"ftp:///README.mdx",children:"ftp:///README.mdx"})}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-markdown",children:"[target.mdx](target.mdx)\n"})}),"\n",(0,n.jsx)(s.h2,{id:"links-in-comments",children:"Links in comments"}),"\n",(0,n.jsx)(s.p,{children:"MDX/HTML comments with invalid file references should not be resolved nor reported by the broken link checker:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-mdx",children:"{/* [doesNotExist.mdx](doesNotExist.mdx) */}\n\n\x3c!-- [doesNotExist.mdx](doesNotExist.mdx) --\x3e\n"})}),"\n","\n",(0,n.jsx)(s.h2,{id:"reference-style-links",children:"Reference-style links"}),"\n",(0,n.jsx)(s.p,{children:"The following should also work:"}),"\n",(0,n.jsx)(s.pre,{children:(0,n.jsx)(s.code,{className:"language-md",children:"Testing some link refs: [link-ref1], [link-ref2], [link-ref3]\n\n[link-ref1]: target.mdx\n[link-ref2]: ./target.mdx\n[link-ref3]: ../links/target.mdx?qs#target-heading\n"})}),"\n",(0,n.jsxs)(s.p,{children:["Testing some link refs: ",(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"link-ref1"}),", ",(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug",children:"link-ref2"}),", ",(0,n.jsx)(s.a,{href:"/tests/docs/tests/links/target-doc-slug?qs#target-heading",children:"link-ref3"})]})]})}function h(e={}){const{wrapper:s}={...(0,l.a)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(a,{...e})}):a(e)}},71670:(e,s,t)=>{t.d(s,{Z:()=>d,a:()=>i});var n=t(27378);const l={},r=n.createContext(l);function i(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:i(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);