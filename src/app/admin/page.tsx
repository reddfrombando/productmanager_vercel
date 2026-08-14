--- a/src/app/admin/page.tsx
+++ b/src/app/admin/page.tsx
@@
-import confetti from "canvas-confetti";
+import confetti from "canvas-confetti";
+import dynamic from "next/dynamic";
+const VersionHistoryPage = dynamic(() => import("@/components/admin/VersionHistoryPage"), { ssr: false });
@@
           {activeTab === "syllabus" && (
@@
           )}
+
+          {/* Version History admin panel */}
+          <VersionHistoryPage />
 
         </main>
