"use client";

import { motion, AnimatePresence } from "framer-motion";
import { History as HistoryIcon, Trash2, Filter, Search } from "lucide-react";
import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { HistoryCard } from "@/components/cards/HistoryCard";
import { useStore } from "@/store/useStore";

type FilterType = "all" | "audio" | "numeric" | "text";

export default function HistoryPage() {
  const { history, clearHistory } = useStore();
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = history.filter((item) => {
    const matchesFilter = filter === "all" || item.type === filter;
    const matchesSearch =
      searchQuery === "" ||
      item.input.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory();
    }
  };

  return (
    <PageWrapper
      title="Analysis History"
      description="View and manage your past AI analyses"
    >
      <Card variant="glass">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-neon-cyan" />
              Recent Analyses
              <Badge variant="default" className="ml-2">
                {history.length} total
              </Badge>
            </CardTitle>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
                {(["all", "audio", "numeric", "text"] as FilterType[]).map(
                  (type) => (
                    <Button
                      key={type}
                      variant={filter === type ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setFilter(type)}
                      className="capitalize"
                    >
                      {type}
                    </Button>
                  )
                )}
              </div>

              {/* Clear Button */}
              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearHistory}
                  className="text-neon-pink border-neon-pink/30 hover:bg-neon-pink/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="popLayout">
            {filteredHistory.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredHistory.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <HistoryCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <HistoryIcon className="w-10 h-10 text-white/20" />
                </div>
                <p className="text-white/40 mb-2">
                  {searchQuery || filter !== "all"
                    ? "No matching results"
                    : "No history yet"}
                </p>
                <p className="text-sm text-white/20">
                  {searchQuery || filter !== "all"
                    ? "Try adjusting your search or filter"
                    : "Start analyzing to build your history"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
