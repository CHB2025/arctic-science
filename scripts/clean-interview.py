import re
import sys


def main(filePaths: list[str]):
   for path in filePaths:
      file = open(path)
      lines = file.readlines()
      file.close()
      newLines = [l for l in lines if not re.search("^[0-9:\-\>\.\s]*\n$", l)][1:]
      groupedLines = newLines[:1]
      for l in newLines[1:]:
         prevPerson, _ = split_line(groupedLines[-1])
         person, text = split_line(l)
         if person != prevPerson:
            groupedLines.append('\n')
            groupedLines.append(person + ':' + text + '')
            continue
         groupedLines[-1] = groupedLines[-1].strip() + ' ' + text

      name = '.'.join(path.split('/')[-1].split('.')[:-1]) + '.txt'
      newFile = open('./output/' + name, 'w')
      newFile.writelines(groupedLines)

def split_line(line: str):
   components = line.split(':')
   if len(components) < 2:
      components.insert(0, 'Unknown')
   
   [person, text] = components
   return (person, text)

if __name__ == "__main__":
   args = sys.argv[1:]
   main(args)